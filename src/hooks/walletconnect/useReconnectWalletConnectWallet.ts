import { useGetStoredAccount, useStoreAccount } from '@recoil/accounts';
import { Result, err, ok } from 'neverthrow';
import { useCallback } from 'react';
import { SerializableWalletConnectWallet, WalletConnectWallet, WalletType } from 'types/wallet';
import WalletConnectSigner from 'lib/WalletConnect/signer';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useConnectWalletConnect from './useConnectWalletConnect';

const useReconnectWalletConnectWallet = () => {
  const getAccount = useGetStoredAccount();
  const storeAccount = useStoreAccount();
  const connectWalletConnect = useConnectWalletConnect();

  return useCallback(
    async (
      serializedWallet: SerializableWalletConnectWallet,
    ): Promise<Result<WalletConnectWallet, Error>> => {
      const account = await getAccount(serializedWallet.address);
      // Ensure that we have the correct account.
      if (account === undefined) {
        return err(new Error(`Account associated to ${serializedWallet.address} not found`));
      }
      if (account.walletType !== WalletType.WalletConnect) {
        return err(
          new Error(
            `Account associated to ${serializedWallet.address} is not a WalletConnect account`,
          ),
        );
      }

      // Initialize the WalletConnect client.
      const connectionResult = await connectWalletConnect();
      if (connectionResult.isErr()) {
        return err(connectionResult.error);
      }

      const client = connectionResult.value;
      const signer = new WalletConnectSigner(serializedWallet.walletApp, client);
      const session = client.session.getAll().find(s => s.topic === account.sessionTopic);

      if (session === undefined) {
        // TODO: The session has expired or has been closed by the user, ask the user if wants
        // to re-connect.

        const connectResult = await promiseToResult(
          signer.connect(),
          'Unknown errow while initializing the WalletConnect session',
        );
        if (connectResult.isErr()) {
          return err(connectResult.error);
        }

        // The new connection has been established,
        // update the account with the new session topic.
        storeAccount({
          ...account,
          sessionTopic: signer.session.topic,
        });
      } else {
        console.log('reconnecting to session', session.topic);
        // We have a session, try to reconnect to it.
        const connectResult = await promiseToResult(
          signer.connectToSession(session),
          'Error while connecting to WalletConnect session',
        );
        if (connectResult.isErr()) {
          console.error('reconnect failed');
          return err(connectResult.error);
        }
      }

      return ok({
        type: WalletType.WalletConnect,
        walletApp: serializedWallet.walletApp,
        address: serializedWallet.address,
        addressPrefix: serializedWallet.addressPrefix,
        signer,
        tempWallet: serializedWallet.tempWallet,
      });
    },
    [connectWalletConnect, getAccount, storeAccount],
  );
};

export default useReconnectWalletConnectWallet;
