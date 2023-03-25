import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { Wallet } from 'types/wallet';
import { DesmosClient } from '@desmoslabs/desmjs';
import { useGetCurrentChainInfo } from '@recoil/settings';
import { SignerData } from '@cosmjs/stargate';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import useSignTx from 'hooks/transactions/useSignTx';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { PendingTransaction } from 'types/transactions';
import { SyncBroadcastResponse } from '@desmoslabs/desmjs/build/types/responses';

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
 * Hook that provides a function to sign a transaction.
 */
const useBroadcastTx = () => {
  const getChainInfo = useGetCurrentChainInfo();

  const unlockWallet = useUnlockWallet();
  const getSignerData = useGetSignerData();
  const signTx = useSignTx();

  return React.useCallback(
    async (
      accountAddressOrWallet: string | Wallet,
      messages: EncodeObject[],
      fees: StdFee,
      memo?: string,
    ): Promise<Result<PendingTransaction, Error>> => {
      // Unlock the wallet
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

      // Get the chain data
      const { rpcUrl } = getChainInfo();

      // Create an instance of DesmosClient that can be used to broadcast the
      // transaction and query data from the chain.
      const clientResult = await ResultAsync.fromPromise(DesmosClient.connect(rpcUrl), () =>
        Error('Error initializing the DesmosClient'),
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

      // Get the transaction to be broadcast
      const txBytes = signResult.value.signatureResult.txRaw;

      // Perform the broadcast
      return ResultAsync.fromPromise(client.broadcastTxSync(txBytes), e =>
        Error(e?.toString() ?? 'Error while signing the transaction'),
      ).map((broadcastResult: SyncBroadcastResponse) => {
        return {
          messages,
          fees: fees.amount,
          user: wallet.address,
          hash: broadcastResult.hash,
          timestamp: new Date().toISOString(),
        } as PendingTransaction;
      });
    },
    [getChainInfo, getSignerData, signTx, unlockWallet],
  );
};

export default useBroadcastTx;
