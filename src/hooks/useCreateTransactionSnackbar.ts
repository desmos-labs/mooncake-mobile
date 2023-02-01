import React from 'react';
import ToastConfig from 'config/ToastConfig';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';
import {
  NotificationType,
  TransactionNotificationData,
} from 'types/notifications';
import {useToast} from 'react-native-toast-notifications';
import {useGetPendingTransaction} from '@recoil/transactions';

const useCreateTransactionSnackbar = () => {
  const toast = useToast();
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
            onPressRetry: () => {
              // Find the matching txHash and rebroadcast its message
              const pendingTx = getPendingTransaction(data.txHash);
              if (pendingTx) {
                encodeAndBroadcastTx({msgs: pendingTx.messages});
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
