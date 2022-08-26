import {MsgGrant} from 'cosmjs-types/cosmos/authz/v1beta1/tx';
import {ChainAccount} from 'types/chains';
import {GenericMsgEnums, GrantEnums} from 'lib/desmos/msgtypes';
import {GenericSubspaceAuthorization} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import Long from 'long';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {MsgGrantEncodeObject} from '@desmoslabs/desmjs';
import {Grant} from 'cosmjs-types/cosmos/authz/v1beta1/authz';

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
