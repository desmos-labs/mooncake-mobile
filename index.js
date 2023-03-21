/**
 * @format
 */
import React from 'react';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { parseRemoteNotification } from 'lib/NotificationsUtils';
import { isSocialNotification } from 'types/notifications';
import createBackgroundNotificationData from 'hooks/notifications/backgroundNotificationsUtils';
import App from './App';
import { name as appName } from './app.json';
import AppSilent from './AppSilent';

// Notification creation for both iOS and Android
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  const notification = parseRemoteNotification(remoteMessage.data);
  if (isSocialNotification(notification)) {
    await createBackgroundNotificationData(notification);
  }
});

// Fake app spawn if a notification is coming from FCM
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // Hack to open the app on ios when a notification is received
    // JSX not allowed in files with extension -> we can ignore safely, it is just a fake app container
    // eslint-disable-next-line react/jsx-filename-extension
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
