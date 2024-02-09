import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { ToastType } from 'config/toast/toastConfig';
import useToast from 'hooks/toasts/useToast';
import React from 'react';
import { NotificationData } from 'types/notifications';
import useHandleNotificationNavigation from './useHandleNotificationNavigation';
import useMarkNotificationAsRead from './useMarkNotificationAsRead';

/**
 * Hook that provides a function to display a toast once a notification
 * is received whne the application is active.
 */
const useShowNotificationToast = () => {
  const showToast = useToast();

  return React.useCallback(
    (notficationData: NotificationData) => {
      showToast({
        toastType: ToastType.info,
        title: notficationData.notification_title,
        message: notficationData.notification_body,
      });
    },
    [showToast],
  );
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
  const markNotificationAsRead = useMarkNotificationAsRead();

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

      markNotificationAsRead(data.notification_id);

      if (!onAppVisible) {
        navigate(data);
      } else {
        showToast(data);
      }
    },
    [markNotificationAsRead, navigate, showToast],
  );
};

export default useParseNotificationAndNavigate;
