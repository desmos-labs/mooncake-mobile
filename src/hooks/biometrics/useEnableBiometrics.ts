import { useSetSetting } from '@recoil/settings';
import * as LocalAuthentication from 'expo-local-authentication';
import { storeBiometricAuthorization } from 'lib/SecureStorage';
import { err, ok } from 'neverthrow';
import { useCallback } from 'react';

/**
 * Hook to enable biometrics
 * @returns Function to enable biometrics
 */
const useEnableBiometrics = () => {
  const setBiometrics = useSetSetting('biometrics');
  /**
   * Function to enable biometrics
   * @param password - Password to encrypt the biometric authorization
   * @param validatePassword - Whether to validate the password or not
   * @param address - Address of the wallet to enable biometrics
   */
  return useCallback(
    async (password: string, validatePassword: boolean, address: string) => {
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        return err('Biometrics not enrolled or permission not granted');
      }
      const result = await storeBiometricAuthorization(password, validatePassword);
      if (result.isErr()) {
        if (validatePassword) {
          return err('Error while enabling biometrics');
        } else {
          return ok(undefined);
        }
      } else {
        setBiometrics(true, address);
        return ok(undefined);
      }
    },
    [setBiometrics],
  );
};

export default useEnableBiometrics;
