import React from 'react';
import { NotificationType, TransactionNotificationData } from 'types/notifications';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useGetPendingTransaction } from '@recoil/transactions';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import { useTranslation } from 'react-i18next';

const useCreateTransactionSnackbar = () => {
  const toast = useCustomToast();
  const { t } = useTranslation();

  const broadcastTx = useBroadcastTx();
  const getPendingTransaction = useGetPendingTransaction();

  return React.useCallback(
    async (data: TransactionNotificationData) => {
      switch (data.type) {
        case NotificationType.TransactionSuccess:
          toast.success(t('toast:transactionSuccess'));
          break;

        case NotificationType.TransactionFail:
          toast.error(t('toast:transactionFailed'), {
            handlePressRetry: async () => {
              // Find the matching txHash and rebroadcast its message
              const pendingTx = getPendingTransaction(data.txHash);
              if (pendingTx) {
                const result = await broadcastTx(pendingTx.messages);
                if (result.isErr()) {
                  // TODO: Show the error somewhere
                }
              }
            },
          });
          break;
      }
    },
    [toast],
  );
};

export default useCreateTransactionSnackbar;
