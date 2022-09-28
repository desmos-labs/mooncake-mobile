import React from 'react';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {getAccounts} from 'lib/SecureStorage';
import {OfflineDirectSigner} from '@cosmjs/proto-signing';
import Login from 'services/axios/requests/Login/index';
import {updateAuthToken} from 'services/axios';
import {generateLoginData} from 'services/axios/requests/Login/utils';

const useLogin = () => {
  const unlockWallet = useUnlockWallet();

  const login = React.useCallback(
    async (activeAddress: string, password?: string) => {
      const accounts = await getAccounts();

      const activeAccount = accounts?.find(x => x.address === activeAddress);

      if (!activeAccount) {
        throw new Error(
          `[LOGIN] No account found for address ${activeAddress}`,
        );
      }

      const unlockResult = await unlockWallet(
        activeAccount!,
        false,
        undefined,
        undefined,
        undefined,
        password,
      );

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

      if (!token) {
        throw new Error('[LOGIN] No token received from Login request');
      }

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
