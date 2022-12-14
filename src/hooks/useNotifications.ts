import messaging from '@react-native-firebase/messaging';
import useFindPendingTx from 'hooks/useFindPendingTx';
import {
  createLocalNotification,
  createTransactionSnackbar,
} from 'lib/NotificationsUtils/notificationsUtils';
import _ from 'lodash';
import {useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';

const useNotifications = () => {
  const toast = useToast();
  const {findPendingTxByHash} = useFindPendingTx();

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const txHash = _.get(remoteMessage, 'data.tx_hash');
      createTransactionSnackbar(
        remoteMessage,
        toast,
        txHash,
        findPendingTxByHash,
      );
      createLocalNotification(remoteMessage);
    });
    return unsubscribe;
  }, [toast]);
};

export default useNotifications;
