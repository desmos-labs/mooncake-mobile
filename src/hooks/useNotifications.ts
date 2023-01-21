import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import useFindPendingTx from 'hooks/useFindPendingTx';
import useHandleNotificationPressEvent from 'hooks/useHandleNotificationPressEvent';
import {
  createLocalNotification,
  createTransactionSnackbar,
} from 'lib/NotificationsUtils/notificationsUtils';
import _ from 'lodash';
import {useCallback, useEffect, useRef, useState} from 'react';
import {AppState} from 'react-native';
import {useToast} from 'react-native-toast-notifications';
import NotificationTypesEnum from 'types/notificationTypes';

const useNotifications = () => {
  const toast = useToast();
  const {findPendingTxByHash} = useFindPendingTx();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const {navigateToCorrectScreen} = useHandleNotificationPressEvent();

  const manageInitialNotifications = useCallback(async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      const {notification} = initialNotification;
      console.log('Received notification', notification);
      navigateToCorrectScreen({
        type: notification?.data?.type as NotificationTypesEnum,
        post_id: notification?.data?.post_id as string,
        comment_id: notification?.data?.comment_id as string,
        reply_id: notification?.data?.reply_id as string,
        subspace_id: notification?.data?.subspace_id as string,
      });
    }
  }, [navigateToCorrectScreen]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      if (nextAppState === 'active') {
        manageInitialNotifications().catch(err => console.error(err));
      }
    });
    return () => {
      subscription.remove();
    };
  }, [manageInitialNotifications]);

  useEffect(() => {
    // Checking if the app is active, if so we do not want to send the user notifications
    // We will be able to use this onMessage to handle different type of notifications, maybe create a snackbar instead
    if (appStateVisible !== 'active') {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const txHash = _.get(remoteMessage, 'data.tx_hash');
        if (txHash) {
          await createTransactionSnackbar(
            remoteMessage,
            toast,
            txHash,
            findPendingTxByHash,
          );
          await createLocalNotification(remoteMessage);
        }
      });
      return () => unsubscribe();
    }
  }, [appStateVisible, findPendingTxByHash, toast]);
};

export default useNotifications;
