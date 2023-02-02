import {
  MsgGrantAllowanceEncodeObject,
  MsgGrantEncodeObject,
  MsgRevokeAllowanceEncodeObject,
  MsgRevokeEncodeObject,
  timestampFromDate,
} from '@desmoslabs/desmjs';
import { GenericSubspaceAuthorization } from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import { Any } from '@desmoslabs/desmjs-types/google/protobuf/any';
import { genericAuthorizationToAny } from '@desmoslabs/desmjs/build/aminomessages/cosmos/authz/authorizations';
import { genericSubspaceAuthorizationToAny } from '@desmoslabs/desmjs/build/aminomessages/subspaces/authorizations';
import EnvConfig from 'config/EnvConfig';
import { GenericAuthorization, Grant } from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import { MsgGrant, MsgRevoke } from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import { AllowedMsgAllowance, BasicAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import { MsgGrantAllowance, MsgRevokeAllowance } from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';
import { GrantEnums } from 'lib/desmos/msgtypes';
import Long from 'long';

/**
 * Build a MsgRevokeAllowanceEncode object.
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#How-to-revoke-an-allowance
 * @param {Object} Object - An object containing a grantee and granter string
 * @param {string} Object.grantee - The address of the grantee.
 * @param {string} Object.granter - The address of the granter.
 * @returns {MsgRevokeAllowanceEncodeObject} An encode object the revokes a previously granted allowance
 */
export const buildRevokeAllowanceEncode = ({
  grantee,
  granter,
}: {
  grantee: string;
  granter: string;
}): MsgRevokeAllowanceEncodeObject => ({
  typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  value: MsgRevokeAllowance.fromPartial({
    grantee,
    granter,
  }),
});

/**
 * Build a MsgGrantAllowanceEncode
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#Authorizing-the-payment-of-fees
 * @param {Object} Object - An object containing the grants to build, a grantee, and granter
 * @param {GrantEnums[]} grants - An array of grants to build allowance grants for
 * @param {string} Object.grantee - The address of the grantee.
 * @param {string} Object.granter - The address of the granter.
 * @returns {MsgGrantAllowanceEncodeObject} An encode object that gives the grantee an allowance to use a granter's funds to conduct transactions
 */
export const buildGrantAllowanceEncode = ({
  grants,
  grantee,
  granter,
}: {
  grants: GrantEnums[];
  grantee: string;
  granter: string;
}): MsgGrantAllowanceEncodeObject => {
  const basicAllowance: BasicAllowance = {
    spendLimit: [], // This is empty so that there are no limits
    expiration: undefined,
  };

  const allowance: AllowedMsgAllowance = {
    allowance: Any.fromPartial({
      typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
      value: BasicAllowance.encode(basicAllowance).finish(),
    }),
    allowedMessages: grants,
  };

  return {
    typeUrl: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
    value: MsgGrantAllowance.fromPartial({
      grantee,
      granter,
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
        value: AllowedMsgAllowance.encode(allowance).finish(),
      }),
    }),
  };
};

/**
 * Build the MsgGrantEncodeObjects from an array of grants.
 * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#How-to-grant-an-authorization
 * @param {Object} Object - An object containing an array of grants, a grantee, and granter
 * @param {GrantEnums[]} grants - An array of grants to build MsgGrantEncodeObjects for.
 * @param {string} Object.grantee - The address of the grantee.
 * @param {string} Object.granter - The address of the granter.
 * @returns {MsgGrantEncodeObject[]} An array of Encode Objects that authorizes a grantee to conduct {grants} type transactions onbehalf of the granter.
 */
export const buildGrantMsgEncodes = ({
  grants,
  grantee,
  granter,
}: {
  grants: GrantEnums[];
  grantee: string;
  granter: string;
}): MsgGrantEncodeObject[] => {
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
 * @param {Object} Object
 * @param {GrantEnums[]} Object.grants - An array of grants to build MsgRevokeEncodeObjects for.
 * @param {string} Object.grantee - The address of the grantee.
 * @param {string} Object.granter - The address of the granter.
 * @returns {MsgRevokeEncodeObject[]} - An array of MsgRevokeEncodeObjects that represent the grants that {granter} wants
 *                                      to revoke from the {grantee}
 */
export const buildRevokeGrantMsgEncodes = ({
  grants,
  grantee,
  granter,
}: {
  grants: GrantEnums[];
  grantee: string;
  granter: string;
}): MsgRevokeEncodeObject[] => {
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
