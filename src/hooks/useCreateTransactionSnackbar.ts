import React from 'react';
import { NotificationType, TransactionNotificationData } from 'types/notifications';
import { useGetPendingTransaction } from '@recoil/transactions';
import { useTranslation } from 'react-i18next';
import useToast from 'hooks/toasts/useToast';
import { ToastType } from 'config/toast/toastConfig';
import { useSignAndBroadcastTx } from 'hooks/tx/useSignAndBroadcastTx';

/**
 * Hook to create a snackbar for a transaction notification.
 */
const useCreateTransactionSnackbar = () => {
  const showToast = useToast();
  const { t } = useTranslation();

  const signAndBroadcastTx = useSignAndBroadcastTx();
  const getPendingTransaction = useGetPendingTransaction();

  return React.useCallback(
    async (data: TransactionNotificationData) => {
      switch (data.type) {
        case NotificationType.TransactionSuccess:
          showToast({
            toastType: ToastType.success,
            title: t('toast:success'),
            message: t('toast:transactionSuccess'),
          });
          break;

        case NotificationType.TransactionFail:
          showToast({
            toastType: ToastType.oneButton,
            message: t('toast:transactionFailed'),
            buttonLabel: t('toast:retry'),
            buttonAction: async () => {
              // Find the matching txHash and rebroadcast its message
              const pendingTx = getPendingTransaction(data.txHash);
              if (pendingTx) {
                await signAndBroadcastTx(pendingTx.messages);
              }
            },
          });

          break;
      }
    },
    [getPendingTransaction, showToast, signAndBroadcastTx, t],
  );
};

export default useCreateTransactionSnackbar;
