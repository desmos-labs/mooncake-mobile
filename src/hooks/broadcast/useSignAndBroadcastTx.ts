import { useCallback, useMemo, useState } from 'react';
import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DeliverTxResponse, DesmosClient, SimulateOptions } from '@desmoslabs/desmjs';
import { err, Result } from 'neverthrow';
import { usePostHog } from 'posthog-react-native';
import * as Sentry from 'sentry-expo';
import { useActiveAccount } from '@recoil/accounts';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { Wallet } from 'types/wallet';
import useSignTx, { SignMode } from 'hooks/tx/useSignTx';
import useBroadcastTx from 'hooks/tx/useBroadcastTx';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { Account, AccountWithWallet } from 'types/account';
import { buildDesmosClient } from 'lib/TxUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';
import { captureFailedFeeEstimationError, captureFailedTxError } from 'lib/PostHogUtils';

/**
 * Hook that allows to estimate the fees of a transaction.
 * If the provided account is undefined, the fees will be estimated for the current active account.
 * @returns A tuple containing:
 * - estimatingFees: a boolean indicating whether the fees are being estimated or not.
 * - estimatedFees: the estimated fees.
 * - estimateFees: a function to call to estimate the fees.
 */
export const useEstimateFees = (providedAccount?: Account) => {
  const [estimatingFees, setEstimatingFees] = useState(false);
  const activeAccount = useActiveAccount()!;
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();
  const posthog = usePostHog();

  const accountToUse = useMemo(
    () => providedAccount ?? activeAccount,
    [activeAccount, providedAccount],
  );

  const estimateFees = useCallback(
    async (
      messages: EncodeObject[],
      options?: Omit<SimulateOptions, 'publicKey'>,
    ): Promise<StdFee> => {
      setEstimatingFees(true);
      let client: DesmosClient | undefined;

      try {
        client = unwrapResult(await buildDesmosClient(chainInfo!.rpcUrl, undefined, gasPrice));

        return client.estimateTxFee(accountToUse.address, messages, {
          publicKey: {
            algo: accountToUse.algo,
            bytes: accountToUse.pubKey,
          },
          memo: options?.memo,
          feeGranter: options?.feeGranter,
        });
      } catch (error) {
        Sentry.Native.captureException(error);
        captureFailedFeeEstimationError(posthog!, {
          error,
          messages,
          userAddress: accountToUse.address,
        });

        // If the fee estimation fails, it might be due to a simulation error.
        // This can happen for example if the user does not yet have on-chain tokens and is trying to pay
        // for fees using a fee grant. Since CosmJS does not support this, the simulation will fail.
        // For this reason, revert to using a standard fee amount instead (gas: 200.000, gas price: 0.1, fee amount : 20000).
        const feeDenom = chainInfo!.stakeCurrency.coinDenom;
        return {
          amount: [{ denom: feeDenom, amount: '20000' }],
          gas: '200000',
        };
      } finally {
        client?.disconnect();
        setEstimatingFees(false);
      }
    },
    [accountToUse.address, accountToUse.algo, accountToUse.pubKey, chainInfo, gasPrice, posthog],
  );

  return {
    estimateFees,
    estimatingFees,
  };
};

/**
 * Hook that provide a function to sign broadcast a list of messages
 * to the chain of the current active account.
 * The function returns a [DeliverTxResponse] if the tx has been sent or
 * undefined if the user have cancelled the wallet unlock procedure.
 */
export const useSignAndBroadcastTx = () => {
  const posthog = usePostHog();
  const signTx = useSignTx();
  const broadcastTx = useBroadcastTx();
  const unlockWallet = useUnlockWallet();

  return useCallback(
    async (
      accountOrAddress: AccountWithWallet | string,
      messages: EncodeObject[],
      fees: StdFee,
      feeGranter?: string,
      memo?: string,
    ): Promise<Result<DeliverTxResponse | undefined, Error>> => {
      // Unlock the wallet
      let wallet: Wallet;
      if (typeof accountOrAddress === 'string') {
        const walletUnlockResult = await unlockWallet({
          toUnlockAddress: accountOrAddress,
        });
        // An error occurred while unlocking the wallet, propagate it.
        if (walletUnlockResult.isErr()) {
          return err(walletUnlockResult.error);
        }
        wallet = walletUnlockResult.value.wallet;
      } else {
        wallet = accountOrAddress.wallet;
      }

      const signResult = await signTx(wallet, {
        mode: SignMode.Online,
        messages,
        fees,
        feeGranter,
        memo,
      });

      if (signResult.isErr()) {
        return err(signResult.error);
      }
      const broadcastTxResult = await broadcastTx(wallet, signResult.value);

      if (broadcastTxResult.isErr()) {
        // Capture broadcast tx errors.
        Sentry.Native.captureException(broadcastTxResult.error);
        captureFailedTxError(posthog!, {
          error: broadcastTxResult.error,
          fees,
          messages,
          userAddress: wallet.address,
        });
      }
      return broadcastTxResult;
    },
    [broadcastTx, signTx, unlockWallet, posthog],
  );
};
