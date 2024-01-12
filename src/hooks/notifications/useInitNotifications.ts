import { firebase } from '@react-native-firebase/messaging';
import React from 'react';
import { AppState } from 'react-native';
import useParseNotificationAndNavigate from './useParseNotificationAndNavigate';

let backgroundNotification: string | object | undefined;

const useInitNotificationsLogic = () => {
  const navigateToCorrectScreen = useParseNotificationAndNavigate();

  // Effect to handle the notification that has triggered the
  // application open from a quiet state.
  React.useEffect(() => {
    firebase.messaging().getToken().then(console.log);

    firebase
      .messaging()
      .getInitialNotification()
      .then(m => {
        backgroundNotification = m?.data?.notification_id;
        navigateToCorrectScreen(m, false);
      });
  }, [navigateToCorrectScreen]);

  // Effect to handle the notification that the user has pressed while the application
  // was in background state.
  React.useEffect(() => {
    return firebase.messaging().onNotificationOpenedApp(m => {
      backgroundNotification = m.data?.notification_id;
      navigateToCorrectScreen(m, false);
    });
  }, [navigateToCorrectScreen]);

  // Effect to handle the notifications received while the application is opened.
  React.useEffect(() => {
    return firebase.messaging().onMessage(m => {
      const notificationId = m.data?.notification_id;
      const sameNotification =
        backgroundNotification !== undefined && backgroundNotification === notificationId;
      if (AppState.currentState === 'active' && !sameNotification) {
        navigateToCorrectScreen(m, true);
      }
    });
  }, [navigateToCorrectScreen]);
};

export default useInitNotificationsLogic;
