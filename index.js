import './src/lib/ignoreWarningsUtils';
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import { registerRootComponent } from 'expo';
import App from './App';

// Init backgroud norification logic
/*
messaging().setBackgroundMessageHandler(backgroundNotificationHandler);
*/

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
