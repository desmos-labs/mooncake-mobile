import React from 'react';
import { deleteBiometricAuthorization, deleteWallet, resetSecureStorage } from 'lib/SecureStorage';
import { BiometricAuthorizations } from 'types/settings';
import { clearMMKV } from 'lib/MMKVStorage';

/**
 * Hook that allows to remove an account by taking the user to the proper in-app screen.
 * This hook will delete the wallet, the secure storage and the MMKV storage.
 */
const useRemoveAccount = () => {
  return React.useCallback(async (address: string) => {
    if (!address) return;
    try {
      // First we try to delete the biometric authorization
      await deleteBiometricAuthorization(BiometricAuthorizations.UnlockWallet);
      // Then we delete the wallet
      await deleteWallet(address);
      // Then we reset the secure storage
      await resetSecureStorage();
      // Finally we clear the MMKV storage
      await clearMMKV();
    } catch (error) {
      console.error(error);
    }
  }, []);
};

export default useRemoveAccount;
