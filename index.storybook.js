/**
 * @format
 */
import './shim';
import './src/assets/locales/i18n';
import { registerRootComponent } from 'expo';
import StorybookUIRoot from './storybook';

registerRootComponent(StorybookUIRoot);
