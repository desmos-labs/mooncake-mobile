import MMKVStorage from 'lib/MMKVStorage';
import {atom} from 'recoil';
import {AppSettings} from 'types/settings';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  biometrics: false,
  notifications: false,
};

/**
 * Recoil atom for the application settings
 */
const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: (() => {
    const savedSettings = MMKVStorage.getString('appSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
    return DefaultAppSettings;
  })(),
  effects: [
    ({onSet}) => {
      onSet(newSettingsValues => {
        MMKVStorage.set('appSettings', JSON.stringify(newSettingsValues));
      });
    },
  ],
});

export default appSettingsState;
