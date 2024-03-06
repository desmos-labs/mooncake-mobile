import { useCallback, useRef } from 'react';
import { WalletConnectWalletApp } from 'types/wallet';
import {
  MooncakePermissionMessages,
  getWalletConnectPermissionMessages,
  initWalletConnectSession,
} from 'lib/WalletConnect';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { buildDesmosClient } from 'lib/TxUtils';
import { PrivateKeySigner, SignatureResult, Signer, SigningMode, TxRaw } from '@desmoslabs/desmjs';
import { Result, err, ok } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { generateWalletConnectWallet } from 'lib/WalletUtils';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import { AccountWithWallet } from 'types/account';
import { WalletConnectSigner } from '@desmoslabs/desmjs-walletconnect-v2';
import useConnectWalletConnect from './useConnectWalletConnect';

interface GrantsSignResult {
  readonly signature: SignatureResult;
  readonly authorizedMessages: string[];
  readonly grantExpiration: Date;
}

const usePromptGrantsRequest = () => {
  const navigation = useRootNavigator();
  const { t } = useTranslation('landing');

  return useCallback(() => {
    return new Promise<boolean>(resolve => {
      navigation.navigate(ROUTES.CONFIRM_MODAL, {
        title: t('authorize mooncake'),
        subtitle: t('authorize mooncake description'),
        primaryButtonLabel: t('authorize', { ns: 'common' }),
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

const useSignAndBroadcastGrants = () => {
  const chainInfo = useCurrentChainInfo()!;
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (signer: Signer, granter: string, grantee: string) => {
      if (chainInfo === undefined) {
        return err(new Error('Unknwon error, chain info is undefined'));
      }
      if (gasPrice === undefined) {
        return err(new Error('Unknwon error, gas price is undefined'));
      }

      const buildResult = await buildDesmosClient(chainInfo.rpcUrl, signer, gasPrice);
      if (buildResult.isErr()) {
        return err(buildResult.error);
      }

      const client = buildResult.value;
      // Create an expiration of one year.
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const messages = getWalletConnectPermissionMessages(granter, grantee, expirationDate);
      // Sign the transaction with the grant.
      const signResult = await promiseToResult(
        client.signTx(granter, messages),
        'Unknown error while signing authz grant',
      );

      if (signResult.isErr()) {
        return err(signResult.error);
      }

      const txRawBytes = TxRaw.encode(signResult.value.txRaw).finish();
      const broadcastResult = await promiseToResult(
        client.broadcastTx(txRawBytes),
        'Unknown error while broadcasting authz grant',
      );

      if (broadcastResult.isErr()) {
        return err(broadcastResult.error);
      }

      return ok({
        signature: signResult.value,
        authorizedMessages: MooncakePermissionMessages,
        grantExpiration: expirationDate,
      });
    },
    [chainInfo, gasPrice],
  );
};

/**
 * Hook that provides a function to start the
 * login through WalletConnect.
 */
const useLoginWithWalletConnect = () => {
  const connectWalletConnectClient = useConnectWalletConnect();
  const promptGrantsRequest = usePromptGrantsRequest();
  const signAndBroadcastGrants = useSignAndBroadcastGrants();
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();
  // Cached WalletConnectSigner that has been previously authorized
  // by the user.
  const cachedWalletConnectSigner = useRef<WalletConnectSigner>();
  // Reference to a previously generated signer,
  // in case we need to retry the session initialization.
  const generatedSigner = useRef<PrivateKeySigner>();
  // Cached grants transaction signature result.
  // If this is defined means that the user has already
  // broadcasted a transaction that gives the permissions
  // to our generated signer.
  const grantsSignResult = useRef<GrantsSignResult>();

  return useCallback(
    async (app: WalletConnectWalletApp): Promise<Result<void, Error>> => {
      let walletConnectSigner = cachedWalletConnectSigner.current;

      if (walletConnectSigner === undefined) {
        // Initialize the WalletConnect client.
        const connectionResult = await connectWalletConnectClient();
        if (connectionResult.isErr()) {
          return err(connectionResult.error);
        }

        // Start the session by sending the request to the external wallet.
        const client = connectionResult.value;
        const sessionInitializationResult = await initWalletConnectSession(client, app);
        if (sessionInitializationResult.isErr()) {
          return err(sessionInitializationResult.error);
        }
        walletConnectSigner = sessionInitializationResult.value;
        cachedWalletConnectSigner.current = walletConnectSigner;
      }

      // We have a WalletConnect session, get the account.
      const accounts = await walletConnectSigner.getAccounts();
      const [account] = accounts;

      // The session is established, if the user didn't accepted
      // a previous request prompt the user to authorize
      // our generated wallet to sign the message on the user
      // behalf.
      const authorized = generatedSigner.current !== undefined || (await promptGrantsRequest());
      let walletConnectAccount: AccountWithWallet;
      if (authorized) {
        // Generate a new private key signer that will be used by the
        // application to sign the transactions without the need to
        // open the external wallet.
        let tempWalletSigner = generatedSigner.current;
        if (tempWalletSigner === undefined) {
          tempWalletSigner = PrivateKeySigner.generate(SigningMode.AMINO);
          // Cache the generated signer.
          generatedSigner.current = tempWalletSigner;
        }
        await tempWalletSigner.connect();

        if (grantsSignResult.current === undefined) {
          // Sign and broadcast the authorization messages.
          const grantee = await tempWalletSigner
            .getCurrentAccount()
            .then(tempWalletAccount => tempWalletAccount!.address);
          const signResult = await signAndBroadcastGrants(
            walletConnectSigner,
            account.address,
            grantee,
          );

          if (signResult.isErr()) {
            return err(signResult.error);
          }

          grantsSignResult.current = signResult.value;
        }

        walletConnectAccount = await generateWalletConnectWallet(app, walletConnectSigner, {
          signer: tempWalletSigner,
          authorizations: grantsSignResult.current.authorizedMessages,
          authorizationsExpiration: grantsSignResult.current.grantExpiration,
        });
      } else {
        // We don't have the user authorization, lets create an account without
        // the temp wallet.
        walletConnectAccount = await generateWalletConnectWallet(app, walletConnectSigner);
      }

      const startLoginResult = await startSaveAccountAndCreateProfileFlow({
        account: walletConnectAccount,
      });

      if (startLoginResult.isErr()) {
        return err(startLoginResult.error);
      }

      // The login succeed, lets clear the ref to avoid the disconnection of our
      // WalletConnect signer.
      cachedWalletConnectSigner.current = undefined;
      generatedSigner.current = undefined;
      grantsSignResult.current = undefined;
      return ok(undefined);
    },
    [
      connectWalletConnectClient,
      promptGrantsRequest,
      signAndBroadcastGrants,
      startSaveAccountAndCreateProfileFlow,
    ],
  );
};

export default useLoginWithWalletConnect;
