import appSettingsState from '@recoil/settings';
import {
  deleteBiometricData,
  getAccounts,
  getLocalWallet,
  getMnemonic,
  setBiometricData,
} from 'lib/SecureStorage';
import React from 'react';
import {useRecoilValue} from 'recoil';
import _ from 'lodash';
import {
  deleteOldWalletData,
  saveNewWalletData,
} from 'hooks/useChangePassword/utils';

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
      const wallets = _.compact(
        await Promise.all(
          accounts.map(async (account: {address: string}) => {
            return getLocalWallet(account.address, oldPassword);
          }),
        ),
      );

      // replace all biometrics passwords if biometrics is enabled
      if (biometrics) {
        await Promise.all([
          deleteBiometricData(),
          setBiometricData(newPassword),
        ]);
      }

      // replace wallet data
      await Promise.all([
        deleteOldWalletData(wallets),
        saveNewWalletData(wallets, mnemonic!, newPassword),
      ]);

      return {success: true, reason: 'success'};
    },
    [biometrics],
  );

  return {
    changePassword,
  };
};

export default useChangePassword;
