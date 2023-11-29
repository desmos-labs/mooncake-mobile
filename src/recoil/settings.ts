import { GasPrice } from '@cosmjs/stargate';
import { DesmosTestnet } from '@desmoslabs/desmjs/build/types/chains';
import { activeAccountAddressState, useActiveAccountAddress } from '@recoil/accounts';
import { findChainInfoByName } from 'lib/ChainsUtils';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { AppSettings } from 'types/settings';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  biometrics: false,
  notifications: false,
  simplifyTxBroadcast: false,
  currentChain: DesmosTestnet,
};

/**
 * Recoil atom for the application settings
 */
const settingsAppState = atom<Record<string, AppSettings>>({
  key: 'settingsAppState',
  default: (() => {
    return getMMKV(MMKVKEYS.APP_SETTINGS) ?? {};
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
      const activeAccountAddress = get(activeAccountAddressState);
      if (!activeAccountAddress) {
        return DefaultAppSettings;
      }

      const settings = get(settingsAppState);
      const userSettings =
        activeAccountAddress && settings[activeAccountAddress]
          ? settings[activeAccountAddress]
          : DefaultAppSettings;
      return userSettings[key];
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
  const activeAccountAddress = useActiveAccountAddress();
  const setSettings = useSetRecoilState(settingsAppState);
  return React.useCallback(
    (setting: AppSettings[K] | ((value: AppSettings[K]) => AppSettings[K]), address?: string) => {
      setSettings(currentSettings => {
        if (!activeAccountAddress && !address) {
          throw new Error('Cannot set settings without active account');
        }

        // Get the settings only for the active address, or the default ones if not valid
        const userSettings =
          currentSettings[activeAccountAddress ?? address!] ?? DefaultAppSettings;

        // Get the current and new setting values
        const currentValue = userSettings[settingKey];
        const newValue = typeof setting === 'function' ? setting(currentValue) : setting;

        // Avoid updating the values if the given value is the same as the current one
        if (newValue === currentValue) {
          return currentSettings;
        }

        // Update the user settings
        const newUserSettings = {
          ...userSettings,
          [settingKey]: newValue,
        };

        // Update the application settings
        return {
          ...currentSettings,
          [activeAccountAddress ?? address!]: newUserSettings,
        };
      });
    },
    [setSettings, activeAccountAddress, settingKey],
  );
};

/**
 * Hook that provide the informations of the current selected chain.
 */
export const useGetCurrentChainInfo = () => {
  const currentChain = useSetting('currentChain');
  return React.useCallback(() => {
    return findChainInfoByName(currentChain.chainName)!;
  }, [currentChain.chainName]);
};

/**
 * Hook that provides the current chain gas price.
 */
export const useGetCurrentChainGasPrice = () => {
  const getCurrentChainInfo = useGetCurrentChainInfo();
  return React.useCallback(() => {
    const currentChainInfo = getCurrentChainInfo();
    if (currentChainInfo === undefined) {
      return undefined;
    }
    // We support only Desmos at the moment so 0.1 is fine.
    return GasPrice.fromString(`0.1${currentChainInfo.stakeCurrency.coinMinimalDenom}`);
  }, [getCurrentChainInfo]);
};
