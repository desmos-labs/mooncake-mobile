import { DesmosClient, EncodeObject } from '@desmoslabs/desmjs';
import usePrepareDesmosClientAndWallet from 'hooks/tx/usePrepareDesmosClientAndWallet';
import React from 'react';
import { err, ok } from 'neverthrow';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useTranslation } from 'react-i18next';
import * as Sentry from 'sentry-expo';
import {
  AndroidTaskNotificationConfig,
  getTaskContext,
  scheduleTask,
  TaskJob,
} from 'lib/BackgroundTaskUtils';

interface BackgroundTxTaskParams {
  readonly signer: string;
  readonly desmosClient: DesmosClient;
  readonly messages: EncodeObject[];
  readonly memo?: string;
}

interface BroadcastBackgroundTxParams {
  readonly messages: EncodeObject[];
  readonly memo?: string;
  readonly onStartMessage?: string;
  readonly onCompleteMessage?: string;
  readonly onErrorMessage?: string;
  readonly notificationConfig?: Partial<AndroidTaskNotificationConfig>;
}

/**
 * Task that can be executed in the background in order to broadcast a generic tx.
 * @param params - Parameters required to create the post.
 * @constructor
 */
const backgroundTxTask: TaskJob<BackgroundTxTaskParams, string> = async params => {
  const { desmosClient, signer, messages, memo } = params;
  const { broadcastTx } = getTaskContext();

  try {
    const result = await broadcastTx(desmosClient, signer, messages, memo);
    return result.transactionHash;
  } catch (error) {
    // Capture the error.
    Sentry.Native.captureException(error, {
      extra: {
        action: 'Broadcast TX',
        messages: messages.map(m => m.typeUrl),
      },
    });

    // Throw it again since the background scheduler relay on thrown exceptions
    // to signal a failed task.
    throw error;
  }
};

/**
 * Hook that provides a function to broadcat a transaction in the background.
 */
const useBackgroundBroradcastTx = () => {
  const getDesmosClient = usePrepareDesmosClientAndWallet();
  const { t } = useTranslation('common');
  const showToast = useToast();

  return React.useCallback(
    async ({
      messages,
      memo,
      onStartMessage,
      onErrorMessage,
      onCompleteMessage,
      notificationConfig,
    }: BroadcastBackgroundTxParams) => {
      // Get the desmos client and wallet
      const getDesmosClientResult = await getDesmosClient();
      if (getDesmosClientResult.isErr()) {
        return err(getDesmosClientResult.error);
      }
      const { wallet, desmosClient } = getDesmosClientResult.value;

      // Prepare the background task.
      const signer = wallet.address;
      const taskRef = await scheduleTask(
        'Broadcast Tx',
        backgroundTxTask,
        {
          signer,
          desmosClient,
          messages,
          memo,
        },
        notificationConfig,
      );

      if (onStartMessage) {
        taskRef.onStart(() => {
          showToast({
            toastType: ToastType.loading,
            message: onStartMessage,
          });
        });
      }
      if (onCompleteMessage) {
        taskRef.onComplete(() => {
          showToast({
            toastType: ToastType.success,
            title: t('success'),
            message: onCompleteMessage,
          });
        });
      }
      if (onErrorMessage) {
        taskRef.onError(() => {
          showToast({
            toastType: ToastType.error,
            title: t('error'),
            message: onErrorMessage,
          });
        });
      }

      return ok(taskRef);
    },
    [getDesmosClient, showToast, t],
  );
};

export default useBackgroundBroradcastTx;
