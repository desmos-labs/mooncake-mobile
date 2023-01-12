import messaging from '@react-native-firebase/messaging';
import useFindPendingTx from 'hooks/useFindPendingTx';
import {
  createLocalNotification,
  createTransactionSnackbar,
} from 'lib/NotificationsUtils/notificationsUtils';
import _ from 'lodash';
import {useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {useToast} from 'react-native-toast-notifications';

const useNotifications = () => {
  const toast = useToast();
  const {findPendingTxByHash} = useFindPendingTx();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    // Checking if the app is active, if so we do not want to send the user notifications
    // We will be able to use this onMessage to handle different type of notifications, maybe create a snackbar instead
    if (appStateVisible !== 'active') {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const txHash = _.get(remoteMessage, 'data.tx_hash');
        if (txHash) {
          createTransactionSnackbar(
            remoteMessage,
            toast,
            txHash,
            findPendingTxByHash,
          );
          createLocalNotification(remoteMessage);
        }
      });
      return unsubscribe;
    }
  }, [toast]);
};

export default useNotifications;
