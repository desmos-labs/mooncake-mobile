import { useCallback } from 'react';
import { WalletConnectWalletApp } from 'types/wallet';
import { initWalletConnectSession } from 'lib/WalletConnect';
import useRootNavigator from 'hooks/navigation/useRootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { buildDesmosClient } from 'lib/TxUtils';
import {
  Authz,
  Posts,
  PrivateKeySigner,
  Profiles,
  Reactions,
  Relationships,
  Signer,
  SigningMode,
  TxRaw,
} from '@desmoslabs/desmjs';
import { err, ok } from 'neverthrow';
import { MsgGrant } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/authz';
import { promiseToResult } from 'lib/NeverThrowUtils';
import elliptic from 'elliptic';
import useErrorModal from 'hooks/modals/useErrorModal';
import useConnectWalletConnect from './useConnectWalletConnect';

const secp256k1 = new elliptic.ec('secp256k1');

const MooncakeMessages = [
  Posts.v3.MsgCreatePostTypeUrl,
  Posts.v3.MsgDeletePostTypeUrl,
  Posts.v3.MsgEditPostTypeUrl,
  Posts.v3.MsgAnswerPollTypeUrl,
  Profiles.v3.MsgSaveProfileTypeUrl,
  Profiles.v3.MsgDeleteProfileTypeUrl,
  Reactions.v1.MsgAddReactionTypeUrl,
  Reactions.v1.MsgRemoveReactionTypeUrl,
  Relationships.v1.MsgCreateRelationshipTypeUrl,
  Relationships.v1.MsgDeleteRelationshipTypeUrl,
  Relationships.v1.MsgBlockUserTypeUrl,
  Relationships.v1.MsgUnblockUserTypeUrl,
];

const usePromptAuthzGrantRequest = () => {
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
      });
    });
  }, [navigation, t]);
};

const useSignAndBroadcastAuthzGrant = () => {
  const chainInfo = useCurrentChainInfo()!;
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (signer: Signer, granter: string, grantee: string) => {
      const buildResult = await buildDesmosClient(chainInfo!.rpcUrl, signer, gasPrice);
      if (buildResult.isErr()) {
        return err(buildResult.error);
      }

      const client = buildResult.value;
      // Create an expiration of one year.
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const messages = MooncakeMessages.map(typeUrl => ({
        typeUrl: Authz.v1beta1.MsgGrantTypeUrl,
        value: MsgGrant.fromPartial({
          grantee,
          granter,
          grant: {
            authorization: {
              typeUrl: Authz.v1beta1.GenericAuthorizationTypeUrl,
              value: GenericAuthorization.encode(
                GenericAuthorization.fromPartial({
                  msg: typeUrl,
                }),
              ).finish(),
            },
            expiration: {
              seconds: Math.ceil(expirationDate.getTime() / 1000),
            },
          },
        }),
      }));

      // Create sign the transaction with the grant.
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
        authorizedMessages: MooncakeMessages,
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
  const { t } = useTranslation('landing');
  const connectWalletConnectClient = useConnectWalletConnect();
  const promptAuthzGrantRequest = usePromptAuthzGrantRequest();
  const signAndBroadcastAuthzGrant = useSignAndBroadcastAuthzGrant();
  const showErrorMessage = useErrorModal();

  return useCallback(
    async (app: WalletConnectWalletApp) => {
      // Initialize the WalletConnect client.
      const connectionResult = await connectWalletConnectClient();
      if (connectionResult.isErr()) {
        showErrorMessage(connectionResult.error.message);
        console.error(
          '[useLoginWithWalletConnect] client initialization failed: ',
          connectionResult.error,
        );
        return;
      }
      console.log('[useLoginWithWalletConnect] Client initialized');

      console.log('[useLoginWithWalletConnect] Generating temp wallet...');
      // Generate a new private key signer that will be used by the
      // application to sign the transactions without the need to
      // open the external wallet.
      const tempWalletSigner = PrivateKeySigner.fromSecp256k1(
        secp256k1.genKeyPair().getPrivate('hex'),
        SigningMode.DIRECT,
      );
      console.log('[useLoginWithWalletConnect] Temp wallet generated');
      await tempWalletSigner.connect();

      // Start the session by sending the request to the external wallet.
      const client = connectionResult.value;
      const sessionInitializationResult = await initWalletConnectSession(client, app);
      if (sessionInitializationResult.isErr()) {
        showErrorMessage(sessionInitializationResult.error.message);
        console.error(
          '[useLoginWithWalletConnect] session initialization failed: ',
          sessionInitializationResult.error,
        );
        return;
      }

      // Session established, get the account.
      const signer = sessionInitializationResult.value;
      const accounts = await signer.getAccounts();
      const [account] = accounts;
      console.log('[useLoginWithWalletConnect] Logged in as: ', account);

      // The session is established, prompt the user to authorize
      // our generated wallet to sign the message on the user
      // behalf.
      const authorized = await promptAuthzGrantRequest();
      if (!authorized) {
        showErrorMessage(t('user rejected the session request'));
        console.error('[useLoginWithWalletConnect] User rejected the authorization');
        await signer.disconnect();
        return;
      }

      // We have the user authorization, lets sign and broadcast the
      // transaction.
      const grantee = await tempWalletSigner
        .getCurrentAccount()
        .then(tempWalletAccount => tempWalletAccount!.address);
      const signResult = await signAndBroadcastAuthzGrant(signer, account.address, grantee);

      if (signResult.isErr()) {
        console.error('[useLoginWithWalletConnect] Authz grant failed: ', signResult.error);
        signer.disconnect();
        return;
      }

      return ok(signResult.value);
    },
    [
      connectWalletConnectClient,
      promptAuthzGrantRequest,
      showErrorMessage,
      signAndBroadcastAuthzGrant,
      t,
    ],
  );
};

export default useLoginWithWalletConnect;
