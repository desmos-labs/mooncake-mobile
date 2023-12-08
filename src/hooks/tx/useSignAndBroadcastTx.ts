import { useCallback } from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { scheduleTask } from 'lib/BackgroundTaskUtils';
import SignAndBroadcastTxTask from 'services/tasks/SignAndBroadcastTx';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import useParseErrorMessage from 'hooks/useParseErrorMessage';

interface PopupOptions {
  readonly title?: string;
  readonly description?: string;
}

interface ActionOptions {
  readonly action?: () => void;
  readonly popup?: PopupOptions;
}

interface ErrorActionOptions {
  readonly action?: (error: Error) => void;
  readonly popup?: PopupOptions;
}

interface SignAndBroadcastOptions {
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
            message: options?.onError?.popup?.description ?? parseError(error.message),
          });
        });
    },
    [prepareDesmosClientAndWallet, t, showToast],
  );
};

export default useSignAndBroadcastTx;
