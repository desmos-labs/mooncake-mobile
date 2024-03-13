import { useGetStoredAccount, useStoreAccount } from '@recoil/accounts';
import { Result, err, ok } from 'neverthrow';
import { useCallback } from 'react';
import { SerializableWalletConnectWallet, WalletConnectWallet, WalletType } from 'types/wallet';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import { CanceledOperationError } from 'types/error';
import { useTranslation } from 'react-i18next';
import { getWalletConnectSigner } from 'lib/WalletConnect';
import { getSdkError } from '@walletconnect/utils';
import useConnectWalletConnect from './useConnectWalletConnect';

const useRequestWalletReinitialization = () => {
  const { t } = useTranslation('walletconnect');
  const navigation = useRootNavigator();

  return useCallback((): Promise<boolean> => {
    return new Promise(resolve => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: t('session expired'),
        subtitle: t('session with external wallet expired, would you like to reconnect'),
        primaryButtonLabel: t('yes', { ns: 'common' }),
        onPressPrimary: () => resolve(true),
        secondaryButtonLabel: t('cancel', { ns: 'common' }),
        onPressSecondary: () => resolve(false),
        removeModalAfterButtonPress: true,
        onDismiss: () => {
          navigation.goBack();
          resolve(false);
        },
      });
    });
  }, [navigation, t]);
};

/**
 * Hook that provides a function to reconnect a wallet imported
 * through WalletConnect.
 */
const useReconnectWalletConnectWallet = () => {
  const getAccount = useGetStoredAccount();
  const storeAccount = useStoreAccount();
  const connectWalletConnect = useConnectWalletConnect();
  const requestReinitialization = useRequestWalletReinitialization();

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
      const getSignerResult = getWalletConnectSigner(client, serializedWallet.walletApp);
      if (getSignerResult.isErr()) {
        return err(getSignerResult.error);
      }
      const signer = getSignerResult.value;
      const session = client.session.getAll().find(s => s.topic === account.sessionTopic);

      if (session === undefined) {
        const reinitialize = await requestReinitialization();
        if (!reinitialize) {
          return err(new CanceledOperationError());
        }

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
        // We have a session, try to reconnect to it.
        const connectResult = await promiseToResult(
          new Promise((resolve, reject) => {
            const timeout = setTimeout(
              () => reject(new Error('Timeout while connecting to WalletConnect session')),
              5000,
            );
            signer
              .connectToSession(session)
              .then(resolve)
              .catch(reject)
              .finally(() => {
                clearTimeout(timeout);
              });
          }),
          'Error while connecting to WalletConnect session',
        );
        if (connectResult.isErr()) {
          client.disconnect({
            topic: session.topic,
            reason: getSdkError('INVALID_SESSION_SETTLE_REQUEST'),
          });
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
    [connectWalletConnect, getAccount, requestReinitialization, storeAccount],
  );
};

export default useReconnectWalletConnectWallet;
