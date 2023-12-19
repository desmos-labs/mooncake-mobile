import React from 'react';
import { AppState } from 'react-native';
import { firebase } from '@react-native-firebase/messaging';
import useParseNotificationAndNavigate from './useParseNotificationAndNavigate';

let notificationSubscription: () => void | undefined;

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
    const subscription = AppState.addEventListener('change', () => {
      console.log('[Notifications] AppState change', AppState.currentState);
      if (AppState.currentState === 'active') {
        notificationSubscription = firebase.messaging().onMessage(m => {
          navigateToCorrectScreen(m, true);
        });
      } else if (AppState.currentState === 'background') {
        if (notificationSubscription) {
          notificationSubscription();
          notificationSubscription = undefined;
        }
      }
    });
    return () => {
      subscription.remove();
    };
  }, [navigateToCorrectScreen]);
};

export default useInitNotificationsLogic;
