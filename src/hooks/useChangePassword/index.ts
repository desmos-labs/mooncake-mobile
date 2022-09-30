import React from 'react';
import useActiveAccount from 'hooks/useActiveAccount';
import {
  deleteLocalWallet,
  deleteMnemonic,
  getLocalWallet,
  getMnemonic,
  saveLocalWallet,
  saveMnemonic,
} from 'lib/SecureStorage';

const useChangePassword = () => {
  const {activeAddress} = useActiveAccount();

  const changePassword = React.useCallback(
    async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      if (!activeAddress) {
        return {success: false, reason: 'no active address found'};
      }
      const mnemonic = await getMnemonic(activeAddress, oldPassword);
      const localWallet = await getLocalWallet(activeAddress, oldPassword);

      // delete old data
      await Promise.all([
        await deleteMnemonic(activeAddress),
        await deleteLocalWallet(activeAddress),
      ]);

      // save new data
      await Promise.all([
        await saveLocalWallet(localWallet!, newPassword),
        await saveMnemonic(activeAddress, mnemonic!, newPassword),
      ]);

      return {success: true};
    },
    [activeAddress],
  );

  return {
    changePassword,
  };
};

export default useChangePassword;
