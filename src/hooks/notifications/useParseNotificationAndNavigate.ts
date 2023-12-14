import React from 'react';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { NotificationData } from 'types/notifications';
import useHandleNotificationNavigation from './useHandleNotificationNavigation';

/**
 * Hook that parse a firebase notification.
 * If the notification has been received in the background then
 * this hook will take care of navigating to the proper screen, otherwise
 * will show a popup to the user.
 */
const useParseNotificationAndNavigate = () => {
  const navigate = useHandleNotificationNavigation();

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

      navigate(data);
    },
    [navigate],
  );
};

export default useParseNotificationAndNavigate;
