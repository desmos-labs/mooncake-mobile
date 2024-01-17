import { EncodeObject } from '@cosmjs/proto-signing';
import { ToastType } from 'config/toast/toastConfig';
import useToast from 'hooks/toasts/useToast';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import useParseErrorMessage from 'hooks/useParseErrorMessage';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import { failedTask } from 'lib/BackgroundTaskUtils/scheduler';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import SignAndBroadcastTxTask from 'services/tasks/SignAndBroadcastTx';
import { Wallet } from 'types/wallet';

const BROADCAST_TX_TASK_NAME = 'Broadcast Transaction';

interface PopupOptions {
  /**
   * Tells if we should display the popup.
   * If undefined will default to true.
   */
  readonly show?: boolean;
  readonly title?: string;
  readonly description?: string;
}

interface ErrorPopupOptions extends PopupOptions {
  /**
   * If defined display a button in the error
   * toast that once clicked will execute the provided
   * function.
   */
  readonly retryAction?: () => void;
  /**
   * Label that will be displayed in the
   * retry button.
   * If undefined will default to "Retry".
   */
  readonly retryLabel?: string;
}

interface ActionOptions {
  readonly action?: () => void;
  readonly popup?: PopupOptions;
}

interface ErrorActionOptions {
  readonly action?: (error: Error) => void;
  readonly popup?: ErrorPopupOptions;
}

interface SignAndBroadcastOptions {
  /**
   * Optional wallet to use to sign the transaction
   * instead of using the current active user's wallet.
   */
  readonly wallet?: Wallet;
  readonly memo?: string;
  readonly onLoading?: ActionOptions;
  readonly onSuccess?: ActionOptions;
  readonly onError?: ErrorActionOptions;
}

/**
 * Hook that provides a function to sign broadcast a list of messages.
 * The transaction will be built, signed and broadcast in the background.
 * TODO: Track operations with PostHog
 */
const useSignAndBroadcastTx = () => {
  const { t } = useTranslation('broadcastTx');
  const showToast = useToast();
  const parseError = useParseErrorMessage();

  const prepareDesmosClientAndWallet = usePrepareDesmosClientAndWallet();

  return useCallback(
    async (messages: EncodeObject[], options?: SignAndBroadcastOptions) => {
      // Get the Desmos Client and wallet
      const result = await prepareDesmosClientAndWallet(options?.wallet);
      if (result.isErr()) {
        showToast({
          toastType: ToastType.error,
          title: t('error', { ns: 'common' }),
          message: result.error.message,
        });
        return failedTask(BROADCAST_TX_TASK_NAME, result.error);
      }
      const { wallet, desmosClient } = result.value;

      // Start the task to sign and broadcast the transaction
      const taskReference = await scheduleTask(
        BROADCAST_TX_TASK_NAME,
        SignAndBroadcastTxTask,
        {
          desmosClient,
          messages,
          signer: wallet.address,
          memo: options?.memo,
        },
        {
          title: options?.onLoading?.popup?.title ?? t('performing transaction'),
          desc: options?.onLoading?.popup?.description ?? t('performing transaction'),
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

          if (options?.onLoading?.popup?.show !== false) {
            showToast({
              toastType: ToastType.loading,
              message: options?.onLoading?.popup?.description ?? t('performing transaction'),
            });
          }
        })
        .onComplete(() => {
          desmosClient.disconnect();
          if (options?.onSuccess?.action) {
            options.onSuccess.action();
          }

          if (options?.onSuccess?.popup?.show !== false) {
            showToast({
              toastType: ToastType.success,
              title: options?.onSuccess?.popup?.title ?? t('success', { ns: 'common' }),
              message: options?.onSuccess?.popup?.description ?? t('operation completed'),
            });
          }
        })
        .onError(({ error }) => {
          desmosClient.disconnect();
          if (options?.onError?.action) {
            options.onError.action(error);
          }

          if (options?.onError?.popup?.show !== false) {
            showToast({
              toastType: ToastType.error,
              title: options?.onError?.popup?.title ?? t('error', { ns: 'common' }),
              message:
                (options?.onError?.popup?.description as string) ?? parseError(error.message),
              retryLabel: options?.onError?.popup?.retryLabel,
              retryAction: options?.onError?.popup?.retryAction,
            });
          }
        });

      return taskReference;
    },
    [prepareDesmosClientAndWallet, t, showToast, parseError],
  );
};

export default useSignAndBroadcastTx;
