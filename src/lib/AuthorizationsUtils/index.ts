import { AuthzGrant, FeeGrant } from 'types/authorizations';
import {
  AllowedMsgAllowanceTypeUrl,
  BasicAllowanceTypeUrl,
  MsgGrantAllowanceEncodeObject,
  MsgGrantAllowanceTypeUrl,
  MsgGrantEncodeObject,
  MsgRevokeAllowanceEncodeObject,
  MsgRevokeEncodeObject,
  timestampFromDate,
} from '@desmoslabs/desmjs';
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import { AllowedMsgAllowance, BasicAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import { genericAuthorizationToAny } from '@desmoslabs/desmjs/build/aminomessages/cosmos/authz/authorizations';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { genericSubspaceAuthorizationToAny } from '@desmoslabs/desmjs/build/aminomessages/subspaces/authorizations';
import { GenericSubspaceAuthorization } from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import Long from 'long';
import EnvConfig from 'config/EnvConfig';
import { MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { EncodeObject } from '@cosmjs/proto-signing';

/**
 * Computes the list of missing messages grant.
 * @param requiredMessageTypes - The list of required message types.
 * @param userGrants - List of user's grants.
 */
export function getMissingAuthzPermissions(
  requiredMessageTypes: string[],
  userGrants: AuthzGrant[],
): string[] {
  return requiredMessageTypes.filter(
    msgType => userGrants.find(grant => grant.msgTypeUrl === msgType) === undefined,
  );
}

/**
 * Computes the list of missing messages grant.
 * @param requiredMessageTypes - The list of required message types.
 * @param feeGrants - List of user's fee grants.
 */
export function getMissingFeeGrantPermissions(
  requiredMessageTypes: string[],
  feeGrants: FeeGrant[],
): string[] {
  const today = new Date();
  const msgsWithFeeGrant = feeGrants
    .filter(feeGrant => {
      // Keep the one without expiration date.
      if (feeGrant.expirationDate === undefined) {
        return true;
      }
      // Keep the one that are still valid right now.
      return feeGrant.expirationDate >= today;
    })
    .flatMap(feeGrant => {
      if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
        return feeGrant.allowance.allowedMessages;
      } else {
        return [];
      }
    });

  return requiredMessageTypes.filter(msgType => msgsWithFeeGrant.indexOf(msgType) === -1);
}

/**
 * Build a MsgRevokeAllowanceEncode object.
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#How-to-revoke-an-allowance
 * @param grantee - The address of the grantee.
 * @param granter - The address of the granter.
 * @returns {MsgRevokeAllowanceEncodeObject} An encode object the revokes a previously granted allowance
 */
export const buildRevokeAllowanceEncode = (
  grantee: string,
  granter: string,
): MsgRevokeAllowanceEncodeObject => ({
  typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  value: MsgRevokeAllowance.fromPartial({
    grantee,
    granter,
  }),
});

/**
 * Build a MsgGrantAllowanceEncode
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#Authorizing-the-payment-of-fees
 * @param {GrantEnums[]} grants - An array of grants to build allowance grants for
 * @param {string} grantee - The address of the grantee.
 * @param {string} granter - The address of the granter.
 * @returns {MsgGrantAllowanceEncodeObject} An encode object that gives the grantee an allowance to use a granter's funds to conduct transactions
 */
export const buildGrantAllowanceEncode = (
  grants: string[],
  grantee: string,
  granter: string,
): MsgGrantAllowanceEncodeObject => {
  const basicAllowance: BasicAllowance = {
    spendLimit: [], // This is empty so that there are no limits
    expiration: undefined,
  };

  const allowance: AllowedMsgAllowance = {
    allowance: Any.fromPartial({
      typeUrl: BasicAllowanceTypeUrl,
      value: BasicAllowance.encode(basicAllowance).finish(),
    }),
    allowedMessages: grants,
  };

  return {
    typeUrl: MsgGrantAllowanceTypeUrl,
    value: MsgGrantAllowance.fromPartial({
      grantee,
      granter,
      allowance: Any.fromPartial({
        typeUrl: AllowedMsgAllowanceTypeUrl,
        value: AllowedMsgAllowance.encode(allowance).finish(),
      }),
    }),
  };
};

/**
 * Create the messages to be sent to the chain to add
 * more messages that can be broadcast from the grantee using the balance of
 * the granter to cover the transaction fees.
 * @param currentFeeGrants - Current fee-grants granted by the granter to grantee.
 * @param grants - List of new message types that will receive the fee grant.
 * @param grantee - Grantee address.
 * @param granter - Granter address.
 */
export const buildGrantAllowanceEncodes = (
  currentFeeGrants: FeeGrant[],
  grants: string[],
  grantee: string,
  granter: string,
): EncodeObject[] => {
  const msgs: EncodeObject[] = [];
  if (grants.length > 0) {
    // The fee grant module don't support the update, we need to remove it
    // and then add it back with the current user's fee grants plus the
    // new ones.
    if (currentFeeGrants.length > 0) {
      msgs.push(buildRevokeAllowanceEncode(grantee, granter));
    }

    // Get the list of the current messages that have a fee grant.
    const newAuthorizations = currentFeeGrants.flatMap(feeGrant => {
      if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
        return feeGrant.allowance.allowedMessages;
      } else {
        return [];
      }
    });

    // Add to the new authorizations list just the message types that weren't
    // there before.
    grants.forEach(authorization => {
      if (newAuthorizations.indexOf(authorization) === -1) {
        newAuthorizations.push(authorization);
      }
    });

    // Push the new fee grant allowance message.
    msgs.push(buildGrantAllowanceEncode(newAuthorizations, grantee, granter));
  }

  return msgs;
};

/**
 * Create the messages to be sent to the chain to remove
 * some messages from the lis of messages that can be broadcast from the
 * grantee using the balance of the granter to cover the transaction fees.
 * @param currentFeeGrants - Current fee-grants granted by the granter to grantee.
 * @param grants - List of message types that to which it will be removed the fee-grant.
 * @param grantee - Grantee address.
 * @param granter - Granter address.
 */
export const buildRevokeAllowanceEncodes = (
  currentFeeGrants: FeeGrant[],
  grants: string[],
  grantee: string,
  granter: string,
): EncodeObject[] => {
  const msgs: EncodeObject[] = [];
  if (grants.length > 0) {
    // The fee grant module don't support the update, we need to remove it
    // and then add it back with the difference from the current configured
    // fee grants minus the one that we want to remove.
    if (currentFeeGrants.length > 0) {
      msgs.push(buildRevokeAllowanceEncode(grantee, granter));
    }

    // Compute the difference between the current user's fee grants and the
    // ones we want to remove.
    const toKeepFeeGrant = currentFeeGrants
      .flatMap(feeGrant => {
        if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
          return feeGrant.allowance.allowedMessages;
        } else {
          return [];
        }
      })
      .filter(feeGrantAllowedMessage => grants.indexOf(feeGrantAllowedMessage) === -1);

    if (toKeepFeeGrant.length > 0) {
      // Generate the new fee grant allowance message.
      msgs.push(buildGrantAllowanceEncode(toKeepFeeGrant, grantee, granter));
    }
  }

  return msgs;
};

/**
 * Build the MsgGrantEncodeObjects from an array of grants.
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#How-to-grant-an-authorization
 * @param grants - An array of grants to build MsgGrantEncodeObjects for.
 * @param grantee - The address of the grantee.
 * @param granter - The address of the granter.
 * @returns {MsgGrantEncodeObject[]} An array of Encode Objects that authorizes a grantee to conduct {grants} type transactions onbehalf of the granter.
 */
export const buildGrantMsgEncodes = (
  grants: string[],
  grantee: string,
  granter: string,
): MsgGrantEncodeObject[] => {
  return grants.map(grant => {
    const content =
      grant === GrantEnums.MsgExecuteContract || grant === GrantEnums.MsgSaveProfile
        ? genericAuthorizationToAny(
            GenericAuthorization.fromPartial({
              msg: grant,
            }),
          )
        : genericSubspaceAuthorizationToAny(
            GenericSubspaceAuthorization.fromPartial({
              subspacesIds: [Long.fromNumber(EnvConfig.APP_SUBSPACE_ID)],
              msg: grant,
            }),
          );
    const _grant: Grant = {
      authorization: content,
      expiration: timestampFromDate(
        new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000), // 10 years expiration
      ),
    };

    return {
      typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
      value: MsgGrant.fromPartial({
        grantee,
        granter,
        grant: _grant,
      }),
    };
  });
};

/**
 * The opposite of buildGrantMsgEncodes, this function will build an array
 * of revoking grants.
 * @param {GrantEnums[]} grants - An array of grants to build MsgRevokeEncodeObjects for.
 * @param {string} grantee - The address of the grantee.
 * @param {string} granter - The address of the granter.
 * @returns {MsgRevokeEncodeObject[]} - An array of MsgRevokeEncodeObjects that represent the grants that {granter} wants
 *                                      to revoke from the {grantee}
 */
export const buildRevokeGrantMsgEncodes = (
  grants: string[],
  grantee: string,
  granter: string,
): MsgRevokeEncodeObject[] => {
  return grants.map(grant => {
    return {
      typeUrl: '/cosmos.authz.v1beta1.MsgRevoke',
      value: MsgRevoke.fromPartial({
        grantee,
        granter,
        msgTypeUrl: grant,
      }),
    };
  });
};
