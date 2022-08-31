import {GrantEnums} from 'lib/desmos/msgtypes';
import {Any} from '@desmoslabs/desmjs-types/google/protobuf/any';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {MsgGrantAllowance} from 'cosmjs-types/cosmos/feegrant/v1beta1/tx';

// eslint-disable-next-line import/prefer-default-export
export const buildMessageGrantAllowance = ({
  grants,
  granter,
  grantee,
}: {
  grants: GrantEnums[];
  granter: string;
  grantee: string;
}): MsgGrantAllowance => {
  const basicAllowance: BasicAllowance = {
    spendLimit: [],
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
    granter,
    grantee,
    allowance: Any.fromPartial({
      typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
      value: AllowedMsgAllowance.encode(allowance).finish(),
    }),
  };
};

// export const buildRevokeFeeGrantMsg = ({
//   grantee,
//   granter,
// }: {
//   grantee: string;
//   granter: string;
// }) => {};
