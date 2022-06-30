import {atom} from 'recoil';
import {AppSettings, DefaultAppSettings} from 'types/settings';

/**
 * Recoil atom for the application settings
 */
const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: DefaultAppSettings,
});

export default appSettingsState;
