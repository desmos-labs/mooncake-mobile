import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import useUnlockWalletWithPassword from 'screens/UnlockWallet/useHooks';
import { err } from 'neverthrow';
import usePerformLogin from 'hooks/apis/usePerformLogin';

const useOnSubmitPassword = () => {
  const activeAddress = useActiveAccountAddress();
  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const performLogin = usePerformLogin();

  return React.useCallback(
    async (password: string) => {
      if (!activeAddress) {
        return err(new Error('No active account address'));
      }

      const walletResult = await unlockWalletWithPassword(activeAddress, password);
      if (walletResult.isErr()) {
        return walletResult;
      }

      const wallet = walletResult.value;
      if (!wallet) {
        return err(new Error('No wallet found'));
      }

      return performLogin(wallet);
    },
    [activeAddress, performLogin, unlockWalletWithPassword],
  );
};

export default useOnSubmitPassword;
