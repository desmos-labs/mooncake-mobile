/**
 * @format
 */
import './shim';
import './src/assets/locales/i18n';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import StorybookUIRoot from './storybook';

AppRegistry.registerComponent(appName, () => StorybookUIRoot);
