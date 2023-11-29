import { PrivateKeyProviderStatus } from '@desmoslabs/desmjs';
import { Web3AuthKeyProvider } from '@desmoslabs/desmjs-web3auth-mobile';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import sleep from 'lib/sleep';
import { generateWeb3AuthWallet } from 'lib/WalletUtils';
import { newWeb3AuthClient, web3AuthLoginParams } from 'lib/Web3AuthUtils';
import { useCallback, useState } from 'react';
import * as Sentry from 'sentry-expo';
import { SupportedChain } from 'types/chains';
import { Web3AuthLoginProvider } from 'types/web3auth';

/**
 * Hook that allows to log in using the Web3Auth protocol.
 * @param chain the chain to use.
 */
const useLoginWithWeb3Auth = (chain: SupportedChain) => {
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();
  const [loginLoading, setLoginLoading] = useState(false);

  /**
   * Function called when the user wants to log in using the Web3Auth protocol.
   * @param loginProvider the login provider to use (google/apple).
   */
  const login = useCallback(
    async (loginProvider: Web3AuthLoginProvider) => {
      // Wait a bit to let the button complete its animation.
      await sleep(250);
      setLoginLoading(true);
      const web3authClient = newWeb3AuthClient();
      await web3authClient.init();
      const keyProvider = new Web3AuthKeyProvider(web3authClient, {
        loginParams: web3AuthLoginParams(loginProvider),
      });

      try {
        // Wait a bit to let the web3auth client initialize with the browser,
        // otherwise it will fail cause the browser will open too fast
        await sleep(1000);
        await keyProvider.connect();
      } catch (e: any) {
        setLoginLoading(false);
        return;
      }

      // If not connected return.
      if (keyProvider.status !== PrivateKeyProviderStatus.Connected) {
        setLoginLoading(false);
        return;
      }

      let privateKey;
      try {
        privateKey = await keyProvider.getPrivateKey();
      } catch (e) {
        Sentry.Native.captureException(e);
        setLoginLoading(false);
        return;
      }

      // Generate the wallet to check.
      const account = await generateWeb3AuthWallet(chain.prefix, loginProvider, privateKey?.key!);
      console.log('[WEB3 WALLET ADDRESS]', account.wallet.address);
      const result = await startSaveAccountAndCreateProfileFlow({ account });
      if (result.isErr()) {
        Sentry.Native.captureException(result.error);
      }
      setLoginLoading(false);
    },
    [chain.prefix, startSaveAccountAndCreateProfileFlow],
  );

  return {
    login,
    loginLoading,
  };
};

export default useLoginWithWeb3Auth;
