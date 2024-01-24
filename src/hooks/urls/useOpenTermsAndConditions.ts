import React from 'react';
import { Linking } from 'react-native';

/**
 * Returns a function that opens the terms and conditions in the browser.
 */
const useOpenTermsAndConditions = () => {
  return React.useCallback(() => {
    Linking.openURL('https://mooncake.space/terms');
  }, []);
};

export default useOpenTermsAndConditions;
