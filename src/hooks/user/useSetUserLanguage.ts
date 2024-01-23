import React from 'react';
import { NativeModules, Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import SetLanguage from 'services/axios/requests/SetLanguage';

/**
 * Hook that allows setting the user language.
 */
const useSetUserLanguage = () => {
  // Get the device language
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLanguages[0] || // iOS 13
        NativeModules.SettingsManager.settings.AppleLocale
      : NativeModules.I18nManager.localeIdentifier;

  // Extract the language iso code, without considering the country code
  const match = deviceLanguage.match(/^[a-zA-Z]{2}/);
  const languageIsoCode = match ? match[0] : 'en';

  return React.useCallback(async () => {
    const serverRequestResult = await SetLanguage(languageIsoCode);
    if (serverRequestResult.isErr()) {
      Sentry.Native.captureException(serverRequestResult.error);
    }
  }, [languageIsoCode]);
};

export default useSetUserLanguage;
