import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import resultTransactions from '@recoil/resultTransactions';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useSetRecoilState} from 'recoil';
import {Result} from 'types/transaction';
import ToastConfig from 'config/ToastConfig';
import usePendingRelationships from '@recoil/pendingTx/pendingRelationships';
import usePendingPosts from 'hooks/usePendingPosts';

const useNotifications = () => {
  const setTransactions = useSetRecoilState(resultTransactions);
  const toast = useToast();
  const {resolveByTxHash} = usePendingRelationships();
  const {resolveByTxHash: resolvePendingPostsByTxHash} = usePendingPosts();

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

        // TODO: refactor this into one function
        resolveByTxHash(remoteMessage?.data?.tx_hash);
        resolvePendingPostsByTxHash(remoteMessage?.data?.tx_hash);

        setTransactions(prev => [
          ...prev,
          {
            hash: remoteMessage?.data?.tx_hash as string,
            result: {type: remoteMessage?.data?.type} as Result,
          },
        ]);
      }
    });
    return unsubscribe;
  }, [toast, resolveByTxHash]);
};

export default useNotifications;
