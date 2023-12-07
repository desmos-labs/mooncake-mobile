import { useCallback, useMemo, useState } from 'react';
import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DesmosClient, SimulateOptions } from '@desmoslabs/desmjs';
import { usePostHog } from 'posthog-react-native';
import * as Sentry from 'sentry-expo';
import { useActiveAccount } from '@recoil/accounts';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { Account } from 'types/account';
import { buildDesmosClient } from 'lib/TxUtils';
import { unwrapResult } from 'lib/NeverThrowUtils';
import { captureFailedFeeEstimationError } from 'lib/PostHogUtils';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import SignAndBroadcastTxTask from 'services/tasks/SignAndBroadcastTx';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';

export interface PopupOptions {
  readonly title?: string;
  readonly description?: string;
}

export interface ActionOptions {
  readonly action?: () => void;
  readonly popup?: PopupOptions;
}

export interface ErrorActionOptions {
  readonly action?: (error: Error) => void;
  readonly popup?: PopupOptions;
}

export interface SignAndBroadcastOptions {
  readonly memo?: string;
  readonly onLoading?: ActionOptions;
  readonly onSuccess?: ActionOptions;
  readonly onError?: ErrorActionOptions;
}

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
 * Hook that provides a function to sign broadcast a list of messages.
 * The transaction will be built, signed and broadcast in the background.
 * TODO: Track operations with PostHog
 */
export const useSignAndBroadcastTx = () => {
  const { t } = useTranslation('broadcastTx');
  const showToast = useToast();

  const prepareDesmosClientAndWallet = usePrepareDesmosClientAndWallet();

  return useCallback(
    async (messages: EncodeObject[], options?: SignAndBroadcastOptions) => {
      // Get the Desmos Client and wallet
      const result = await prepareDesmosClientAndWallet();
      if (result.isErr()) {
        showToast({
          toastType: ToastType.error,
          title: t('error', { ns: 'common' }),
          message: result.error.message,
        });
        return;
      }
      const { wallet, desmosClient } = result.value;

      // Start the task to sign and broadcast the transaction
      const taskReference = await scheduleTask(
        'Broadcast Transaction',
        SignAndBroadcastTxTask,
        {
          desmosClient,
          messages,
          signer: wallet.address,
          memo: options?.memo,
        },
        {
          title: options?.onLoading?.popup?.title ?? t('performing transaction'),
          desc: options?.onLoading?.popup?.description,
          progressBar: {
            indeterminate: true,
          },
        },
      );
      taskReference
        .onStart(() => {
          if (options?.onLoading?.action) {
            options.onLoading.action();
          }

          showToast({
            toastType: ToastType.loading,
            message: options?.onLoading?.popup?.description ?? t('performing transaction'),
          });
        })
        .onComplete(() => {
          desmosClient.disconnect();
          if (options?.onSuccess?.action) {
            options.onSuccess.action();
          }
          showToast({
            toastType: ToastType.success,
            title: options?.onSuccess?.popup?.title ?? t('success', { ns: 'common' }),
            message: options?.onSuccess?.popup?.description ?? t('operation completed'),
          });
        })
        .onError(({ error }) => {
          desmosClient.disconnect();
          if (options?.onError?.action) {
            options.onError.action(error);
          }
          showToast({
            toastType: ToastType.error,
            title: options?.onError?.popup?.title ?? t('error', { ns: 'common' }),
            message: options?.onError?.popup?.description ?? error.message,
          });
        });
    },
    [prepareDesmosClientAndWallet, t, showToast],
  );
};
