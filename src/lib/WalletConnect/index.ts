import SignClient from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';
import { WalletConnectWalletApp } from 'types/wallet';
import { Result } from 'neverthrow';
import { WalletConnectSigner } from '@desmoslabs/desmjs-walletconnect-v2';
import {
  Authz,
  EncodeObject,
  Feegrant,
  Posts,
  Profiles,
  Reactions,
  Relationships,
  Reports,
} from '@desmoslabs/desmjs';
import { MsgGrant } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/tx';
import { GenericAuthorization } from '@desmoslabs/desmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrantAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import { AllowedMsgAllowance, BasicAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { toTimestamp } from '@desmoslabs/desmjs-types/helpers';
import { initDPMWalletConnectSession } from './dpm';

/**
 * List of messages that the application should
 * be able to sign and broadcast in order to work
 * when operates through an account on behalf of another user.
 */
export const MooncakePermissionMessages = [
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

export const initWalletConnectSession = async (
  client: SignClient,
  app: WalletConnectWalletApp,
  previousSession?: SessionTypes.Struct,
): Promise<Result<WalletConnectSigner, Error>> => {
  switch (app) {
    case WalletConnectWalletApp.DPM:
      return initDPMWalletConnectSession(client, previousSession);
    default:
      throw new Error(`unsupported WalletConnect app ${app}`);
  }
};

/**
 * Function that provides the list of message that should be broadcasted
 * in order to authorized the grantee to sign the transactions
 * on behalf of the granter;
 * @param granter - The address of the granter.
 * @param grantee - The address of the grantee.
 * @param expiration - The permissions expiration date.
 */
export const getWalletConnectPermissionMessages = (
  granter: string,
  grantee: string,
  expiration: Date,
): EncodeObject[] => {
  const messages: EncodeObject[] = MooncakePermissionMessages.map(typeUrl => ({
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
        expiration: toTimestamp(expiration),
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
                  expiration: toTimestamp(expiration),
                }),
              ).finish(),
            },
            allowedMessages: ['/cosmos.authz.v1beta1.MsgExec'],
          }),
        ).finish(),
      },
    }),
  });

  return messages;
};
