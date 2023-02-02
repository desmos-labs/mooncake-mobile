/**
 * @format
 */
import React from 'react';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useCreateLocalNotification } from 'lib/NotificationsUtils/notificationsUtils';
import App from './App';
import { name as appName } from './app.json';
import AppSilent from './AppSilent';

// Notification creation for both iOS and Android
messaging().setBackgroundMessageHandler(async remoteMessage => {
  await useCreateLocalNotification(remoteMessage);
});

// Fake app spawn if a notification is coming from FCM
function HeadlessCheck({ isHeadless }) {
  if (isHeadless) {
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
