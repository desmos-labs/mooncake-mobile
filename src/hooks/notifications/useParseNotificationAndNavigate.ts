import React from 'react';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NotificationData } from 'types/notifications';
import useHandleNotificationNavigation from './useHandleNotificationNavigation';

/**
 * Hook that provides a function to display a toast once a notification
 * is received whne the application is active.
 */
const useShowNotificationToast = () => {
  return React.useCallback((notficationData: NotificationData) => {
    // TODO: Implement the notification toast display logic.
    console.warn('TODO: Display notification toast', notficationData);
  }, []);
};

/**
 * Hook that parse a firebase notification.
 * If the notification has been received in the background then
 * this hook will take care of navigating to the proper screen, otherwise
 * will show a popup to the user.
 */
const useParseNotificationAndNavigate = () => {
  const navigate = useHandleNotificationNavigation();
  const showToast = useShowNotificationToast();

  return React.useCallback(
    (
      firebaseMessage: FirebaseMessagingTypes.RemoteMessage | null | undefined,
      onAppVisible: boolean,
    ) => {
      if (!firebaseMessage) {
        return undefined;
      }

      const data = firebaseMessage.data as unknown as NotificationData;
      if (__DEV__) {
        console.log(`[Firebase]: Received notification, onAppVisible: ${onAppVisible}`);
        console.log('[Firebase]: RemoteMessage', firebaseMessage);
        console.log('[Firebase]: Data', data);
      }

      if (!onAppVisible) {
        navigate(data);
      } else {
        showToast(data);
      }
    },
    [navigate, showToast],
  );
};

export default useParseNotificationAndNavigate;
