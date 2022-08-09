import {atom} from 'recoil';
import {AppSettings} from 'types/settings';
import {getMMKV, setMMKV, MMKVKEYS} from 'lib/MMKVStorage';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  biometrics: false,
  notifications: false,
  dataInitialized: false,
};

/**
 * Recoil atom for the application settings
 */
const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: (() => {
    const savedSettings = getMMKV(MMKVKEYS.APP_SETTINGS);

    return savedSettings || DefaultAppSettings;
  })(),
  effects: [
    ({onSet}) => {
      onSet(newSettingsValues => {
        setMMKV(MMKVKEYS.APP_SETTINGS, newSettingsValues);
      });
    },
  ],
});

export default appSettingsState;
