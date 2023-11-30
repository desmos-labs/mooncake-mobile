import React, { useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Hook to check if biometrics are available
 */
const useCheckBiometrics = () => {
  const [biometricsAvailable, setBiometricsAvailable] = React.useState(true);

  /**
   * Function to check if biometrics are available
   * @returns Result of the operation
   */
  const checkBiometrics = useCallback(async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      setBiometricsAvailable(false);
    }
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    setBiometricsAvailable(isEnrolled);
  }, []);

  return {
    biometricsAvailable,
    checkBiometrics,
  };
};

export default useCheckBiometrics;
