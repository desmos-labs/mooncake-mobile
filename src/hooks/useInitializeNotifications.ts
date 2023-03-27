import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import useHandleNotificationPressEvent from 'hooks/notifications/useHandleNotificationPressEvent';
import { useCallback, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { useSetAppStateValue } from '@recoil/appState';
import useCreateLocalNotification from 'hooks/notifications/useCreateLocalNotification';
import {
  isSocialNotification,
  isTransactionNotification,
  NotificationType,
} from 'types/notifications';
import useCreateTransactionNotificationSnackbar from 'hooks/useCreateTransactionSnackbar';
import { parseRemoteNotification } from 'lib/NotificationsUtils';
import useHandleSuccessfulTransaction from 'hooks/transactions/useHandleSuccessfulTransaction';

/**
 * Hook to initialize the notifications handling.
 */
const useInitializeNotifications = () => {
  // Hook to handle a successful transaction
  const handleSuccessfulTransaction = useHandleSuccessfulTransaction();

  // Utility hooks to create the notifications UI
  const createLocalNotification = useCreateLocalNotification();
  const createTransactionNotificationSnackbar = useCreateTransactionNotificationSnackbar();

  // Contains the current application visibility state
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);

  const setNotificationsCount = useSetAppStateValue('notificationsCount');
  const setAppState = useSetAppStateValue('appActiveState');

  const handleNotificationPressEvent = useHandleNotificationPressEvent();

  const manageInitialNotifications = useCallback(async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      // iOS Badges
      const actualBadgeCount = await notifee.getBadgeCount();
      await notifee.setBadgeCount(actualBadgeCount - 1);

      // Global notifications management
      setNotificationsCount(count => {
        return count ? count - 1 : 0;
      });

      // Navigation to the correct screen based on notification
      const { notification } = initialNotification;
      // The notification created when the app receives a notification in the background has already been parsed, but it is not typed
      // because notifee cast it into a generic object when spawning a notification
      // ------ see @Notification type (data property) in @notifee/react-native ------
      // To avoid any type mismatch we need to cast as any this object
      handleNotificationPressEvent(notification.data as any);
    }
  }, [handleNotificationPressEvent, setNotificationsCount]);

  useEffect(() => {
    // Here we need to manage the initial notification when the app is closed
    manageInitialNotifications().catch(err => console.error(err));
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppStateVisible(nextAppState);
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        // Here we need to manage the initial notification when the app is opened from the background, cause
        // line 62 is not called in this case, since the app has already been mounted
        setNotificationsCount(current => current ?? 0);
      }
    });

    // Unsubscribe the listener when the effect is destroyed
    return () => subscription.remove();
  }, [manageInitialNotifications, setAppState, setNotificationsCount]);

  useEffect(() => {
    // We will be able to use this onMessage to handle different type of notifications, maybe create a snackbar instead
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const notification = parseRemoteNotification(remoteMessage.data);
      if (isTransactionNotification(notification)) {
        if (notification.type === NotificationType.TransactionSuccess) {
          // Handle the update of the data
          await handleSuccessfulTransaction(notification.txHash);
        }

        // Create a notification snackbar
        await createTransactionNotificationSnackbar(notification);
      } else if (isSocialNotification(notification)) {
        // Checking if the app is active, if so we do not want to send the user social notifications
        if (appStateVisible !== 'active') {
          await createLocalNotification(notification);
        }
      }
    });

    // Unsubscribe the listener when the effect is destroyed
    return () => unsubscribe();
  }, [
    appStateVisible,
    createLocalNotification,
    createTransactionNotificationSnackbar,
    handleSuccessfulTransaction,
  ]);
};

export default useInitializeNotifications;
