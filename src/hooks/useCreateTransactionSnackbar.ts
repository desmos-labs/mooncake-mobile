import React from 'react';
import ToastConfig from 'config/ToastConfig';
import { NotificationType, TransactionNotificationData } from 'types/notifications';
import { useToast } from 'react-native-toast-notifications';
import { useGetPendingTransaction } from '@recoil/transactions';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';

const useCreateTransactionSnackbar = () => {
  const toast = useToast();

  const broadcastTx = useBroadcastTx();
  const getPendingTransaction = useGetPendingTransaction();

  return React.useCallback(
    async (data: TransactionNotificationData) => {
      switch (data.type) {
        case NotificationType.TransactionSuccess:
          toast.show('Transaction success!', {
            type: ToastConfig.SUCCESS,
          });
          break;

        case NotificationType.TransactionFail:
          toast.show('Transaction failed!', {
            type: ToastConfig.ERROR,
            // @ts-ignore - TODO: Investigate this
            onPressRetry: async () => {
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
