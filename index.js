/**
 * @format
 */
import React from 'react';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {createLocalNotification} from 'lib/NotificationsUtils/notificationsUtils';
import App from './App';
import {name as appName} from './app.json';
import AppSilent from './AppSilent';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  createLocalNotification(remoteMessage);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    console.log('Headless');
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
