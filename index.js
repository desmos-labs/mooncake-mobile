import { registerRootComponent } from 'expo';
import { handleBackcroundNotifications } from 'lib/NotificationsUtils';
import messaging from '@react-native-firebase/messaging';
import './src/lib/ignoreWarningsUtils';
import './shim';
import './src/assets/locales/i18n';
import branch from 'react-native-branch';
import { parseBranchParams, setCachedUriAction } from 'lib/BranchUtils';
import App from './App';

// Init branch
branch.subscribe(({ params, error }) => {
  if (error === null) {
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
  }
});

// Init background notification logic
messaging().setBackgroundMessageHandler(handleBackcroundNotifications);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
