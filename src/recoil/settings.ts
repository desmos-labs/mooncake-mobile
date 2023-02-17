import React from 'react';
import { DesmosTestnet } from '@desmoslabs/desmjs/build/types/chains';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { AppSettings } from 'types/settings';
import EnvConfig from 'config/EnvConfig';
import { DesmosMainnet } from '@desmoslabs/desmjs';
import { findChainInfoByName } from 'lib/ChainsUtils';
import { GasPrice } from '@cosmjs/stargate';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  biometrics: false,
  notifications: false,
  notificationsPermission: false,
  currentChain: EnvConfig.CHAIN === 'mainnet' ? DesmosMainnet : DesmosTestnet,
  newDiscPostNotification: true,
  newFollowPostNotification: true,
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
    ({ onSet }) => {
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
    ({ get }) => {
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
    (setting: AppSettings[K] | ((value: AppSettings[K]) => AppSettings[K])) => {
      setSettings(currentValue => {
        const newValue =
          typeof setting === 'function' ? setting(currentValue[settingKey]) : setting;

        if (newValue !== currentValue[settingKey]) {
          return currentValue;
        }

        return { ...currentValue, [settingKey]: newValue };
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

/**
 * Hook that provides the application settings.
 */
export const useSettings = () => useRecoilValue(settingsAppState);

/**
 * Hook that provide the informations of the current selected chain.
 */
export const useCurrentChainInfo = () => {
  const settings = useSettings();
  return React.useMemo(
    () => findChainInfoByName(settings.currentChain.chainName)!,
    [settings.currentChain],
  );
};

/**
 * Hook that provides the current chain gas price.
 */
export const useCurrentChainGasPrice = () => {
  const currentChainInfo = useCurrentChainInfo();
  return React.useMemo(() => {
    if (currentChainInfo === undefined) {
      return undefined;
    }
    // We support only Desmos at the moment so 0.1 is fine.
    return GasPrice.fromString(`0.1${currentChainInfo.stakeCurrency.coinMinimalDenom}`);
  }, [currentChainInfo]);
};
