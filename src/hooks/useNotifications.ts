import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import ToastConfig from 'config/ToastConfig';
import useFindPendingTx from 'hooks/useFindPendingTx';
import _ from 'lodash';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {encodeAndBroadcastTx} from 'services/axios/requests/CentralizedBroadcastTx';

const useNotifications = () => {
  const toast = useToast();
  const {findPendingTxByHash} = useFindPendingTx();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const txHash = _.get(remoteMessage, 'data.tx_hash');
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
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          sound: 'default',
          vibration: true,
        });

        await notifee.displayNotification({
          title: remoteMessage.data?.notification_title,
          body: remoteMessage.data?.notification_body,
          android: {
            channelId,
            smallIcon: 'ic_small_icon',
            pressAction: {
              id: 'default',
            },
          },
          ios: {
            interruptionLevel: 'active',
            foregroundPresentationOptions: {
              badge: true,
              sound: true,
              banner: true,
              list: true,
            },
            sound: 'default',
          },
        });
      }
    });
    return unsubscribe;
  }, [toast]);
};

export default useNotifications;
