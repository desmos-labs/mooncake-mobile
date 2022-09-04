import {MsgGrant} from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {ChainAccount} from 'types/chains';
import {GenericMsgEnums, GrantEnums} from 'lib/desmos/msgtypes';
import {GenericSubspaceAuthorization} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import Long from 'long';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {
  MsgGrantAllowanceEncodeObject,
  MsgGrantEncodeObject,
  MsgRevokeAllowanceEncodeObject,
} from '@desmoslabs/desmjs';
import {Grant} from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';

// eslint-disable-next-line import/prefer-default-export
export const createAuthMsgEncode = ({
  chainAccount,
  scope,
  granteeAddress,
}: {
  chainAccount: ChainAccount;
  scope: GrantEnums;
  granteeAddress: string;
}) => {
  const subspaceAuthorization: GenericSubspaceAuthorization = {
    subspacesIds: [Long.fromNumber(5)],
    msg: scope,
  };

  const grant: Grant = {
    authorization: Any.fromPartial({
      typeUrl: '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
      value: GenericSubspaceAuthorization.encode(
        subspaceAuthorization,
      ).finish(),
    }),
  };

  const msgGrant: MsgGrant = {
    granter: chainAccount.address,
    grantee: granteeAddress,
    grant,
  };

  const encodeObject: MsgGrantEncodeObject = {
    typeUrl: GenericMsgEnums.MsgGrant,
    value: msgGrant,
  };
  return encodeObject;
};

export const buildRevokeAllowanceEncode = ({
  grantee,
  granter,
}: {
  grantee: string;
  granter: string;
}): MsgRevokeAllowanceEncodeObject => ({
  typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
  value: {
    grantee,
    granter,
  },
});

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
    expiration: undefined, // This is null so that the allowance will never expire
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
    value: {
      grantee,
      granter,
      allowance: Any.fromPartial({
        typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
        value: AllowedMsgAllowance.encode(allowance).finish(),
      }),
    },
  };
};

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
    const subspaceAuthorization: GenericSubspaceAuthorization = {
      subspacesIds: [Long.fromNumber(5)], // 5 is our app's subspace id
      msg: grant,
    };

    const _grant: Grant = {
      authorization: Any.fromPartial({
        typeUrl: '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
        value: GenericSubspaceAuthorization.encode(
          subspaceAuthorization,
        ).finish(),
      }),
    };

    return {
      typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
      value: {
        grantee,
        granter,
        grant: _grant,
      },
    };
  });
};
