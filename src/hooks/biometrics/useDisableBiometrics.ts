import { useSetSetting } from '@recoil/settings';
import * as LocalAuthentication from 'expo-local-authentication';
import { deleteBiometricAuthorization } from 'lib/SecureStorage';
import { err, ok } from 'neverthrow';
import { useCallback } from 'react';

/**
 * Hook to disable biometrics
 */
const useDisableBiometrics = () => {
  const setBiometrics = useSetSetting('biometrics');
  /**
   * Function to disable biometrics
   * @returns Result of the operation
   */
  return useCallback(async () => {
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return err('Biometrics not enrolled or permission not granted');
    }
    const result = await deleteBiometricAuthorization();
    if (result.isErr()) {
      console.error(result.error);
      return err('Error while enabling biometrics');
    } else {
      setBiometrics(false);
      return ok(undefined);
    }
  }, [setBiometrics]);
};

export default useDisableBiometrics;
