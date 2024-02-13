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
  EncodeObject,
  Feegrant,
  Posts,
  PrivateKeySigner,
  Profiles,
  Reactions,
  Relationships,
  Reports,
  Signer,
  SigningMode,
  TxRaw,
} from '@desmoslabs/desmjs';
import { err, ok } from 'neverthrow';
import { MsgGrant } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/tx';
import { MsgGrantAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import { BasicAllowance, AllowedMsgAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { GenericAuthorization } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/authz';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useErrorModal from 'hooks/modals/useErrorModal';
import { generateWalletConnectWallet } from 'lib/WalletUtils';
import useSaveAccountAndCreateProfileFlow from 'hooks/accounts/useSaveAccountAndCreateProfile';
import { AccountWithWallet } from 'types/account';
import useConnectWalletConnect from './useConnectWalletConnect';

const MooncakeMessages = [
  // x/posts messages.
  Posts.v3.MsgCreatePostTypeUrl,
  Posts.v3.MsgEditPostTypeUrl,
  Posts.v3.MsgDeletePostTypeUrl,
  Posts.v3.MsgAddPostAttachmentTypeUrl,
  Posts.v3.MsgRemovePostAttachmentTypeUrl,
  Posts.v3.MsgAnswerPollTypeUrl,
  Posts.v3.MsgRequestPostOwnerTransferTypeUrl,
  Posts.v3.MsgCancelPostOwnerTransferRequestTypeUrl,
  Posts.v3.MsgAcceptPostOwnerTransferRequestTypeUrl,
  Posts.v3.MsgRefusePostOwnerTransferRequestTypeUrl,
  // x/profiles message.
  Profiles.v3.MsgSaveProfileTypeUrl,
  Profiles.v3.MsgDeleteProfileTypeUrl,
  Profiles.v3.MsgRequestDTagTransferTypeUrl,
  Profiles.v3.MsgCancelDTagTransferRequestTypeUrl,
  Profiles.v3.MsgAcceptDTagTransferRequestTypeUrl,
  Profiles.v3.MsgRefuseDTagTransferRequestTypeUrl,
  // x/reactions messages.
  Reactions.v1.MsgAddReactionTypeUrl,
  Reactions.v1.MsgRemoveReactionTypeUrl,
  // x/relationships messages.
  Relationships.v1.MsgCreateRelationshipTypeUrl,
  Relationships.v1.MsgDeleteRelationshipTypeUrl,
  Relationships.v1.MsgBlockUserTypeUrl,
  Relationships.v1.MsgUnblockUserTypeUrl,
  // x/reports
  Reports.v1.MsgCreateReportTypeUrl,
  Reports.v1.MsgDeleteReportTypeUrl,
  // x/wasm messages.
  '/cosmwasm.wasm.v1.MsgExecuteContract',
];

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
      const buildResult = await buildDesmosClient(chainInfo!.rpcUrl, signer, gasPrice);
      if (buildResult.isErr()) {
        return err(buildResult.error);
      }

      const client = buildResult.value;
      // Create an expiration of one year.
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);

      const messages: EncodeObject[] = MooncakeMessages.map(typeUrl => ({
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

      // Add a Feegrant so that the temporary wallet can broadcast
      // the transactions using the user's wallet balance.
      messages.push({
        typeUrl: Feegrant.v1beta1.MsgGrantAllowanceTypeUrl,
        value: MsgGrantAllowance.fromPartial({
          granter,
          grantee,
          allowance: {
            typeUrl: Feegrant.v1beta1.AllowedMsgAllowanceTypeUrl,
            value: AllowedMsgAllowance.encode(
              AllowedMsgAllowance.fromPartial({
                allowance: {
                  typeUrl: Feegrant.v1beta1.BasicAllowanceTypeUrl,
                  value: BasicAllowance.encode(
                    BasicAllowance.fromPartial({
                      expiration: { seconds: Math.ceil(expirationDate.getTime() / 1000) },
                    }),
                  ).finish(),
                },
                allowedMessages: MooncakeMessages,
              }),
            ).finish(),
          },
        }),
      });

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
  const promptGrantsRequest = usePromptGrantsRequest();
  const signAndBroadcastGrants = useSignAndBroadcastGrants();
  const showErrorMessage = useErrorModal();
  const startSaveAccountAndCreateProfileFlow = useSaveAccountAndCreateProfileFlow();

  return useCallback(
    async (app: WalletConnectWalletApp) => {
      // Initialize the WalletConnect client.
      const connectionResult = await connectWalletConnectClient();
      if (connectionResult.isErr()) {
        showErrorMessage(connectionResult.error.message);
        return;
      }

      // Start the session by sending the request to the external wallet.
      const client = connectionResult.value;
      const sessionInitializationResult = await initWalletConnectSession(client, app);
      if (sessionInitializationResult.isErr()) {
        showErrorMessage(sessionInitializationResult.error.message);
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
      const authorized = await promptGrantsRequest();
      let walletConnectAccount: AccountWithWallet;
      if (authorized) {
        // Generate a new private key signer that will be used by the
        // application to sign the transactions without the need to
        // open the external wallet.
        const tempWalletSigner = PrivateKeySigner.generate(SigningMode.AMINO);
        await tempWalletSigner.connect();
        // Sign and broadcast the authorization messages.
        const grantee = await tempWalletSigner
          .getCurrentAccount()
          .then(tempWalletAccount => tempWalletAccount!.address);
        const signResult = await signAndBroadcastGrants(signer, account.address, grantee);

        if (signResult.isErr()) {
          showErrorMessage(t('grant transaction failed', { message: signResult.error.message }));
          return;
        }
        walletConnectAccount = await generateWalletConnectWallet(app, signer, {
          signer: tempWalletSigner,
          authorizations: signResult.value.authorizedMessages,
          authorizationsExpiration: signResult.value.grantExpiration,
        });
      } else {
        // We don't have the user authorization, lets create an account without
        // the temp wallet.
        walletConnectAccount = await generateWalletConnectWallet(app, signer);
      }

      startSaveAccountAndCreateProfileFlow({ account: walletConnectAccount });
    },
    [
      connectWalletConnectClient,
      promptGrantsRequest,
      showErrorMessage,
      signAndBroadcastGrants,
      startSaveAccountAndCreateProfileFlow,
      t,
    ],
  );
};

export default useLoginWithWalletConnect;
