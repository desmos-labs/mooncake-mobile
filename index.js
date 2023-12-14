import 'fastestsmallesttextencoderdecoder';
import { registerRootComponent } from 'expo';
import { handleBackcroundNotifications } from 'lib/NotificationsUtils';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import './src/lib/ignoreWarningsUtils';
import './shim';
import './src/assets/locales/i18n';

// Init backgroud norification logic
messaging().setBackgroundMessageHandler(handleBackcroundNotifications);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
