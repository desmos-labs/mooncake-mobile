/**
 * @format
 */
import React from 'react';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import {name as appName} from './app.json';
import AppSilent from './AppSilent';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    sound: 'default',
    vibration: true,
  });

  if (
    remoteMessage.data?.type !== 'transaction_success' &&
    remoteMessage.data?.type !== 'transaction_fail'
  ) {
    await notifee.displayNotification({
      title: remoteMessage.data?.notification_title,
      body: remoteMessage.data?.notification_body,
      android: {
        channelId,
        smallIcon: 'ic_small_icon',
        pressAction: {
          id: 'default',
        },
      },
      ios: {
        interruptionLevel: 'active',
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
        sound: 'default',
      },
    });
  }
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    console.log('Headless');
    return <AppSilent />;
  }

  return <App />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
