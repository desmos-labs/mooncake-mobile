import React from 'react';
import { Linking } from 'react-native';

/**
 * Returns a function that opens the privacy policy in the browser.
 */
const useOpenPrivacyPolicy = () => {
  return React.useCallback(() => {
    Linking.openURL('https://mooncake.space/privacy');
  }, []);
};

export default useOpenPrivacyPolicy;
