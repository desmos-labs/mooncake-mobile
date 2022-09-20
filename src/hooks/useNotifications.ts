import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import resultTransactions from '@recoil/resultTransactions';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState} from 'recoil';
import {Result} from 'types/transaction';

const useNotifications = () => {
  const [transactions, setTransactions] = useRecoilState(resultTransactions);
  const toast = useToast();

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
        console.log(remoteMessage.data);
        toast.show('Transaction success!', {
          type: 'butterSuccess',
        });
        /*        if (remoteMessage?.data?.result?.type === 'transaction_success') {
          toast.show('Transaction success!', {
            type: 'butterSuccess',
          });
        } else {
          toast.show('Transaction failed!', {
            type: 'butterFailure',
          });
        } */
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
  }, []);
};

export default useNotifications;
