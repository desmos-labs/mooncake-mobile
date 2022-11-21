import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useFindPendingTx from 'hooks/useFindPendingTx';
import _ from 'lodash';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';

const useNotifications = () => {
  const toast = useToast();
  const {findPendingTxByHash} = useFindPendingTx();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

      const txHash = _.get(remoteMessage, 'data.tx_hash');

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
              // @ts-ignore
              onPressRetry: () => {
                // find the matching txHash and rebroadcast its message
                const pendingTx = findPendingTxByHash(txHash);
                if (pendingTx) {
                  const {msg} = pendingTx;
                  encodeAndBroadcastTx({msgs: [msg]});
                }
              },
            });
          } else {
            toast.show('State of transaction unknown', {
              type: ToastConfig.ERROR,
            });
          }
        }, 100);
      }
    });
    return unsubscribe;
  }, [toast]);
};

export default useNotifications;
