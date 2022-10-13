/**
 * @format
 */
import './shim';
import './src/assets/locales/i18n';
import 'fastestsmallesttextencoderdecoder';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
