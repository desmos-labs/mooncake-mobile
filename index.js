/**
 * @format
 */
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import { LogBox } from 'react-native';
import branch from 'react-native-branch';
import { registerRootComponent } from 'expo';
import App from './App';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  '`useBottomSheetDynamicSnapPoints` will be deprecated in the next major release! please use the new introduce prop `enableDynamicSizing`',
]);

// Init branch.
branch.subscribe(({ params, error }) => {
  /*  if (error === null) {
    const parsedAction = parseBranchParams(params);
    if (parsedAction !== undefined) {
      if (__DEV__) {
        console.log('[Branch]:', 'Parsed action', parsedAction);
      }
      setCachedUriAction(parsedAction);
    }
  } else {
    if (__DEV__) {
      console.error('[Branch]:', error);
    }
  } */
});

// Init backgroud norification logic
/*
messaging().setBackgroundMessageHandler(backgroundNotificationHandler);
*/

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
