import appSettingsState from '@recoil/settings';
import {getAccounts, getLocalWallet, getMnemonic} from 'lib/SecureStorage';
import React from 'react';
import {useRecoilValue} from 'recoil';
import _ from 'lodash';
import {
  deleteOldWalletData,
  replaceBiometricsData,
  saveNewWalletData,
} from './utils';

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

      const cleanedWalletArr = _.compact(wallets);
      // delete old data
      // use compact to sanitize undefined wallets
      await deleteOldWalletData(cleanedWalletArr);

      // replace all biometrics passwords if biometrics is enabled
      if (biometrics) {
        await replaceBiometricsData(accounts, cleanedWalletArr, newPassword);
      }

      // save new data
      await saveNewWalletData(cleanedWalletArr, mnemonic!, newPassword);

      return {success: true, reason: 'success'};
    },
    [biometrics],
  );

  return {
    changePassword,
  };
};

export default useChangePassword;
