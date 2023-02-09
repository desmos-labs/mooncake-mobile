import React from 'react';
import ToastConfig from 'config/ToastConfig';
import { NotificationType, TransactionNotificationData } from 'types/notifications';
import { useToast } from 'react-native-toast-notifications';
import { useGetPendingTransaction } from '@recoil/transactions';
import useBroadcastTxWithApi from 'hooks/useBroadcastTxWithApi';

const useCreateTransactionSnackbar = () => {
  const toast = useToast();
  const getPendingTransaction = useGetPendingTransaction();
  const broadcastTxWithApi = useBroadcastTxWithApi();

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
            onPressRetry: () => {
              // Find the matching txHash and rebroadcast its message
              const pendingTx = getPendingTransaction(data.txHash);
              if (pendingTx) {
                broadcastTxWithApi(pendingTx.messages);
              }
            },
          });
          break;
      }
    },
    [broadcastTxWithApi, getPendingTransaction, toast],
  );
};

export default useCreateTransactionSnackbar;
