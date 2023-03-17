import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { Wallet } from 'types/wallet';
import { DeliverTxResponse, DesmosClient, TxRaw } from '@desmoslabs/desmjs';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { SignerData } from '@cosmjs/stargate';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import useSignTx from 'hooks/transactions/useSignTx';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { useStoredAccounts } from '@recoil/accounts';
import { BroadcastTxOnChainResult, PendingTransaction } from 'types/transactions';

/**
 * Hook that provide a function to get the information of an account
 * required to perform a signature.
 */
const useGetSignerData = () => {
  return React.useCallback(
    async (client: DesmosClient, wallet: Wallet): Promise<Result<SignerData, Error>> => {
      const accountSequenceResult = await ResultAsync.fromPromise(
        client.getSequence(wallet.address),
        () => Error("Can't get account sequence"),
      );
      if (accountSequenceResult.isErr()) {
        return err(accountSequenceResult.error);
      }

      const chainIdResult = await ResultAsync.fromPromise(client.getChainId(), () =>
        Error("Can't get chainId"),
      );
      if (chainIdResult.isErr()) {
        return err(chainIdResult.error);
      }

      return ok({
        chainId: chainIdResult.value,
        sequence: accountSequenceResult.value.sequence,
        accountNumber: accountSequenceResult.value.accountNumber,
      });
    },
    [],
  );
};

/**
 * Hook to estimate the fees of a transaction.
 */
export const useEstimateFees = () => {
  const { rpcUrl } = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();
  const accounts = useStoredAccounts();

  return React.useCallback(
    async (accountAddress: string, messages: EncodeObject[], memo?: string) => {
      const account = accounts[accountAddress];
      if (account === undefined) {
        return err(Error(`Can't find account with address ${accountAddress}`));
      }

      const clientResult = await ResultAsync.fromPromise(
        DesmosClient.connect(rpcUrl, {
          gasPrice,
        }),
        () => Error("Can't prepare client to estimate fees"),
      );
      if (clientResult.isErr()) {
        return err(clientResult.error);
      }

      return ResultAsync.fromPromise(
        clientResult.value.estimateTxFee(accountAddress, messages, {
          memo,
          publicKey: {
            algo: account.algo,
            bytes: account.pubKey,
          },
        }),
        e => Error((<Partial<Error>>e)?.message ?? "Can't estimate fees"),
      );
    },
    [accounts, rpcUrl, gasPrice],
  );
};

/**
 * Hook that provides a function to sign a transaction.
 */
export function useBroadcastTx() {
  const chainInfo = useCurrentChainInfo();

  const unlockWallet = useUnlockWallet();
  const getSignerData = useGetSignerData();
  const signTx = useSignTx();

  return React.useCallback(
    async (
      accountAddressOrWallet: string | Wallet,
      messages: EncodeObject[],
      fees: StdFee,
      memo?: string,
    ): Promise<Result<BroadcastTxOnChainResult, Error>> => {
      let wallet: Wallet;
      if (typeof accountAddressOrWallet === 'string') {
        const walletUnlockResult = await unlockWallet(accountAddressOrWallet);
        // An error occurred while unlocking the wallet, propagate it.
        if (walletUnlockResult.isErr()) {
          return err(walletUnlockResult.error);
        }
        wallet = walletUnlockResult.value;
      } else {
        wallet = accountAddressOrWallet;
      }

      // Create an instance of DesmosClient that can be used to broadcast the
      // transaction and query data from the chain.
      const clientResult = await ResultAsync.fromPromise(
        DesmosClient.connect(chainInfo.rpcUrl),
        () => Error('Error initializing the DesmosClient'),
      );
      // An error occurred while connecting to the chain.
      if (clientResult.isErr()) {
        return err(clientResult.error);
      }
      const client = clientResult.value;

      // Get the sequence of the account that will be used to sign the transaction.
      const signerDataResult = await getSignerData(client, wallet);
      // An error occurred while getting the signer data.
      if (signerDataResult.isErr()) {
        return err(signerDataResult.error);
      }

      // Sign the transaction.
      const signResult = await signTx(wallet, {
        messages,
        fees,
        signerData: signerDataResult.value,
        memo,
      });
      // An error occurred during the signing process.
      if (signResult.isErr()) {
        return err(signResult.error);
      }

      // Encode the transaction to bytes.
      const txBytes = TxRaw.encode(signResult.value.signatureResult.txRaw).finish();

      // Perform the broadcast
      // TODO: Change this to *not* wait for a block inclusion. We can safely wait for the TX_ASYNC checks only
      return ResultAsync.fromPromise(client.broadcastTx(txBytes), e =>
        Error(e?.toString() ?? 'Error while signing the transaction'),
      ).map((broadcastResult: DeliverTxResponse) => {
        return {
          pendingTransaction: {
            messages,
            fees: fees.amount,
            user: wallet.address,
            hash: broadcastResult.transactionHash,
            timestamp: new Date().toISOString(),
          } as PendingTransaction,
          response: broadcastResult,
        } as BroadcastTxOnChainResult;
      });
    },
    [chainInfo.rpcUrl, getSignerData, signTx, unlockWallet],
  );
}
