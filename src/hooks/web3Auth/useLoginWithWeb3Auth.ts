import { PrivateKeyProviderStatus } from '@desmoslabs/desmjs';
import { Web3AuthKeyProvider } from '@desmoslabs/desmjs-web3auth-mobile';
import * as Sentry from '@sentry/react-native';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import sleep from 'lib/sleep';
import { generateWeb3AuthWallet } from 'lib/WalletUtils';
import { newWeb3AuthClient, web3AuthLoginParams } from 'lib/Web3AuthUtils';
import { useCallback } from 'react';
import { SupportedChain } from 'types/chains';
import { Web3AuthLoginProvider } from 'types/web3auth';

/**
 * Hook that allows to log in using the Web3Auth protocol.
 * @param chain the chain to use.
 */
const useLoginWithWeb3Auth = (chain: SupportedChain) => {
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();

  /**
   * Function called when the user wants to log in using the Web3Auth protocol.
   * @param loginProvider the login provider to use (google/apple).
   */
  return useCallback(
    async (loginProvider: Web3AuthLoginProvider) => {
      // Wait a bit to let the button complete its animation.
      await sleep(250);
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
        return;
      }

      // If not connected return.
      if (keyProvider.status !== PrivateKeyProviderStatus.Connected) {
        // TODO: Show this error in a toast
        // showToast({
        //   toastType: ToastType.error,
        //   title: 'Error',
        //   message: 'Unable to connect to the Web3Auth provider, please try again',
        // });
        return;
      }
      let privateKey;
      try {
        privateKey = await keyProvider.getPrivateKey();
      } catch (e) {
        Sentry.captureException(e);
        // TODO: Show this error in a toast
        // showToast({
        //   toastType: ToastType.error,
        //   title: 'Error',
        //   message: 'An error occurred while getting the private key',
        // });
        return;
      }

      // Generate the wallet to check.
      const account = await generateWeb3AuthWallet(chain.prefix, loginProvider, privateKey?.key!);
      console.log('[WEB3 WALLET ADDRESS]', account.wallet.address);
      const result = await startSaveAccountAndCreateProfileFlow({ account });
      if (result.isErr()) {
        Sentry.captureException(result.error);
        // TODO: Show this error in a toast
        // showToast({
        //   toastType: ToastType.error,
        //   title: 'Error',
        //   message: result.error.message,
        // });
      }
    },
    [chain.prefix, startSaveAccountAndCreateProfileFlow],
  );
};

export default useLoginWithWeb3Auth;
