import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import resultTransactions from '@recoil/resultTransactions';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import {Result} from 'types/transaction';
import ToastConfig from 'config/ToastConfig';
import usePendingTransactions from '@recoil/pendingTransactionsState';

const useNotifications = () => {
  const [transactions, setTransactions] = useRecoilState(resultTransactions);
  const toast = useToast();
  const {resolveByTxHash} = usePendingTransactions();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      if (remoteMessage.notification) {
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          android: {
            channelId,
            pressAction: {
              id: 'default',
            },
          },
        });
      } else if (remoteMessage.data) {
        setTimeout(() => {
          if (remoteMessage.data?.type === 'transaction_success') {
            toast.show('Transaction success!', {
              type: ToastConfig.SUCCESS,
            });
          } else if (remoteMessage.data?.type === 'transaction_fail') {
            toast.show('Transaction failed!', {
              type: ToastConfig.ERROR,
            });
          } else {
            toast.show('State of transaction unknown', {
              type: ToastConfig.ERROR,
            });
          }
        }, 100);

        resolveByTxHash(remoteMessage?.data?.tx_hash);

        setTransactions([
          ...transactions,
          {
            hash: remoteMessage.data.tx_hash,
            result: {type: remoteMessage.data.type} as Result,
          },
        ]);
      }
    });
    return unsubscribe;
  }, [toast, resolveByTxHash]);
};

export default useNotifications;
