import React from 'react';
import { AppState } from 'react-native';
import { firebase } from '@react-native-firebase/messaging';
import useParseNotificationAndNavigate from './useParseNotificationAndNavigate';

const useInitNotificationsLogic = () => {
  const navigateToCorrectScreen = useParseNotificationAndNavigate();

  // Effect to handle the notification that has triggered the
  // application open from a quiet state.
  React.useEffect(() => {
    firebase.messaging().getToken().then(console.log);

    firebase
      .messaging()
      .getInitialNotification()
      .then(m => navigateToCorrectScreen(m, false));
  }, [navigateToCorrectScreen]);

  // Effect to handle the notification that the user has pressed while the application
  // was in background state.
  React.useEffect(() => {
    return firebase.messaging().onNotificationOpenedApp(m => navigateToCorrectScreen(m, false));
  }, [navigateToCorrectScreen]);

  // Effect to handle the notifications received while the application is opened.
  React.useEffect(() => {
    return firebase.messaging().onMessage(m => {
      if (AppState.currentState === 'active') {
        navigateToCorrectScreen(m, true);
      }
    });
  }, [navigateToCorrectScreen]);
};

export default useInitNotificationsLogic;
