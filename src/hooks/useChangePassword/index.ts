import appSettingsState from '@recoil/settings';
import {
  deleteLocalWallet,
  deleteMnemonic,
  deletePasswordWithBiometrics,
  getAccounts,
  getLocalWallet,
  getMnemonic,
  saveLocalWallet,
  saveMnemonic,
  savePasswordWithBiometrics,
} from 'lib/SecureStorage';
import React from 'react';
import {useRecoilValue} from 'recoil';

/**
 * A hook that allows the user to change the password of the current active account
 */
const useChangePassword = () => {
  const {biometrics} = useRecoilValue(appSettingsState);

  const changePassword = React.useCallback(
    async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }): Promise<{success: boolean; reason: string}> => {
      const accounts = await getAccounts();
      if (!accounts) {
        return {success: false, reason: 'no active account found'};
      }
      // get a mnemonic (every account will have the same mnemonic)
      const mnemonic = await getMnemonic(accounts[0].address, oldPassword);
      // get old data
      const wallets = await Promise.all(
        accounts.map(async (account: {address: string}) => {
          return getLocalWallet(account.address, oldPassword);
        }),
      );
      // delete old biometric password
      if (biometrics) {
        await deletePasswordWithBiometrics(accounts[0].address);
      }

      // delete old data
      await Promise.all(
        wallets.map(async wallet => {
          await deleteMnemonic(wallet?.bech32Address!);
          await deleteLocalWallet(wallet?.bech32Address!);
        }),
      );

      // save new biometric password
      if (biometrics) {
        await savePasswordWithBiometrics(wallets[0]!, newPassword);
      }

      // save new data
      await Promise.all(
        wallets.map(async wallet => {
          await saveLocalWallet(wallet!, newPassword);
          await saveMnemonic(wallet?.bech32Address!, mnemonic!, newPassword);
        }),
      );

      return {success: true, reason: 'success'};
    },
    [biometrics],
  );

  return {
    changePassword,
  };
};

export default useChangePassword;
