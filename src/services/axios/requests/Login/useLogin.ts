import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {getAccounts} from 'lib/SecureStorage';
import React from 'react';
import {updateAuthToken} from 'services/axios';
import Login from 'services/axios/requests/Login/index';
import {generateLoginData} from 'services/axios/requests/Login/utils';

const useLogin = () => {
  const unlockWallet = useUnlockWallet();

  const login = React.useCallback(
    async ({
      activeAddress,
      password,
      isDerivedPassword,
    }: {
      activeAddress: string;
      password: string;
      isDerivedPassword?: boolean;
    }) => {
      const accounts = await getAccounts();

      const activeAccount = accounts.find(x => x.address === activeAddress);

      if (!activeAccount) {
        throw new Error(
          `[LOGIN] No account found for address ${activeAddress}`,
        );
      }

      const unlockResult = await unlockWallet({
        chainAccount: activeAccount,
        shouldReplaceRoute: false,
        prefilledPassword: password,
        isDerivedPassword,
      });

      if (!unlockResult || !unlockResult.wallet) {
        throw new Error('[LOGIN] Unable to resolve wallet from unlock request');
      }

      const {wallet} = unlockResult;

      const {signatureBytes, pubkeyBytes, signedBytes} =
        await generateLoginData({
          wallet: wallet as OfflineDirectSigner,
          address: activeAddress,
        });

      const {token} = await Login({
        address: activeAddress,
        signatureBytes,
        pubkeyBytes,
        signedBytes,
      });

      updateAuthToken(token);

      return true;
    },
    [],
  );

  return {
    login,
  };
};

export default useLogin;
