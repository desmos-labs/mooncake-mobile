/**
 * @format
 */
import React from 'react';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import AppSilent from './AppSilent';

// Notification creation for both iOS and Android
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  /*  const createLocalNotification = useCreateLocalNotification();
  const notification = parseRemoteNotification(remoteMessage.data);
  if (isSocialNotification(notification)) {
    await createLocalNotification(notification);
  } */
});

// Fake app spawn if a notification is coming from FCM
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    // eslint-disable-next-line react/jsx-filename-extension
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
