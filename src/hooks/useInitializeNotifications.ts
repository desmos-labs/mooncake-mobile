import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import useHandleNotificationPressEvent from 'hooks/useHandleNotificationPressEvent';
import {useCallback, useEffect, useState} from 'react';
import {AppState} from 'react-native';
import {useSetAppStateValue} from '@recoil/appState';
import useCreateLocalNotification from 'hooks/useCreateLocalNotification';
import {
  isSocialNotification,
  isTransactionNotification,
} from 'types/notifications';
import useCreateTransactionNotificationSnackbar from 'hooks/useCreateTransactionSnackbar';
import {parseRemoteNotification} from 'lib/NotificationsUtils';

/**
 * Hook to initialize the notifications handling.
 */
const useInitializeNotifications = () => {
  // Utility hooks to create the notifications UI
  const createLocalNotification = useCreateLocalNotification();
  const createTransactionNotificationSnackbar =
    useCreateTransactionNotificationSnackbar();

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
      const {notification} = initialNotification;
      handleNotificationPressEvent(parseRemoteNotification(notification.data));
    }
  }, [handleNotificationPressEvent]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppStateVisible(nextAppState);
      setAppState(nextAppState);
      if (nextAppState === 'active') {
        setNotificationsCount(current => current ?? 0);
        manageInitialNotifications().catch(err => console.error(err));
      }
    });

    // Unsubscribe the listener when the effect is destroyed
    return () => subscription.remove();
  }, [manageInitialNotifications]);

  useEffect(() => {
    // Checking if the app is active, if so we do not want to send the user notifications
    // We will be able to use this onMessage to handle different type of notifications, maybe create a snackbar instead
    if (appStateVisible !== 'active') {
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        const notification = parseRemoteNotification(remoteMessage);
        if (isTransactionNotification(notification)) {
          await createTransactionNotificationSnackbar(notification);
        } else if (isSocialNotification(notification)) {
          await createLocalNotification(notification);
        }
      });

      // Unsubscribe the listener when the effect is destroyed
      return () => unsubscribe();
    }
  }, [
    appStateVisible,
    createTransactionNotificationSnackbar,
    createLocalNotification,
  ]);
};

export default useInitializeNotifications;
