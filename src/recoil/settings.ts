import React from 'react';
import {DesmosTestnet} from '@desmoslabs/desmjs/build/types/chains';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {atom, selectorFamily, useRecoilValue, useSetRecoilState} from 'recoil';
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
  appActiveState: 'unknown',
};

/**
 * Recoil atom for the application settings
 */
const settingsAppState = atom<AppSettings>({
  key: 'settingsAppState',
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

/**
 * Recoil that allows to select a single setting value.
 */
const settingState = selectorFamily({
  key: 'setting',
  get:
    (key: keyof AppSettings) =>
    ({get}) => {
      const settings = get(settingsAppState);
      return settings[key];
    },
});

/**
 * Hook that allows to observe only a single setting value.
 * @param settingKey - Key associated to the setting that needs to be retrieved.
 * @return The value of the setting associated with the given key.
 */
export const useSetting = <K extends keyof AppSettings>(settingKey: K) =>
  useRecoilValue(settingState(settingKey)) as AppSettings[K];

/**
 * Hook that provides a function to update the value of a setting.
 * @param settingKey - Key of the setting of interest.
 */
export const useSetSetting = <K extends keyof AppSettings>(settingKey: K) => {
  const setSettings = useSetSettings();
  return React.useCallback(
    (setting: AppSettings[K]) => {
      setSettings(currentValue => {
        const settings: AppSettings = {
          ...currentValue,
        };
        settings[settingKey] = setting;
        return settings;
      });
    },
    [settingKey, setSettings],
  );
};

/**
 * Hook that provides a function to update the entire set of application settings in one go.
 *
 * <b>Note</b>
 * By using this hook, you will trigger the refresh of all the hooks that rely even on a single setting key.
 * Please make sure you use this sparingly, and prefer {@link useSetSetting} whenever possible instead.
 */
export const useSetSettings = () => useSetRecoilState(settingsAppState);
