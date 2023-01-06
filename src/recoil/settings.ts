import {DesmosTestnet} from '@desmoslabs/desmjs/build/types/chains';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {atom} from 'recoil';
import {AppSettings} from 'types/settings';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  biometrics: false,
  notifications: false,
  notificationsPermission: false,
  dataInitialized: false,
  currentTimezone: '',
  registeredReactions: [],
  registeredReports: [],
  contractsConfig: [],
  currentChain: DesmosTestnet,
  newDiscPostNotification: true,
  newFollowPostNotification: true,
};

/**
 * Recoil atom for the application settings
 */
const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: (() => {
    const savedSettings = getMMKV<AppSettings>(MMKVKEYS.APP_SETTINGS);

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
