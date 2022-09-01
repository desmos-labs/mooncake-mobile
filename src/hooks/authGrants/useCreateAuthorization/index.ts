import React from 'react';
import {useButterConfig} from '@recoil/butterConfigState';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useBroadcastMessages from 'hooks/broadcastTx/useBroadcastMessages';
import {computeGasAndFees} from 'lib/desmos/fees';
import EnvConfig from 'config/EnvConfig';
import {OfflineSigner} from '@cosmjs/proto-signing';
import useGetActiveGrants from 'services/axios/requests/GetActiveGrants/useGetActiveGrants';
import _ from 'lodash';
import {
  MsgGrantAllowanceEncodeObject,
  MsgGrantEncodeObject,
  MsgRevokeAllowanceEncodeObject,
} from '@desmoslabs/desmjs';
import {
  AllowedMsgAllowance,
  BasicAllowance,
} from 'cosmjs-types/cosmos/feegrant/v1beta1/feegrant';
import {Any} from 'cosmjs-types/google/protobuf/any';
import {createAuthMsgEncode} from './utils';

/**
 * MVP msg authorizations
 * post
 * add reaction
 * remove reaction
 * follow user
 * unfollow user
 * report content
 */

const useCreateAuthGrant = () => {
  const {butterConfig} = useButterConfig();
  const {chainAccount, loading} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const broadcastMessages = useBroadcastMessages();
  const {getActiveGrants} = useGetActiveGrants();

  const granteeAddress = React.useMemo(() => {
    return butterConfig.desmos_address;
  }, [butterConfig.desmos_address]);

  const requestAndUpdateGrants = React.useCallback(
    async ({grantsToRequest}: {grantsToRequest: GrantEnums[]}) => {
      if (!chainAccount) throw new Error('No active chain account found.');
      const grantsData = await getActiveGrants();

      const {grants, has_fee_grant} = grantsData;

      if (_.difference(grantsToRequest, grants).length === 0) return;

      // Need to revoke old fee grant if one exists

      const msgRevokeAllowanceEncode:
        | MsgRevokeAllowanceEncodeObject
        | undefined = has_fee_grant
        ? {
            typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
            value: {
              granter: butterConfig.desmos_address,
              grantee: chainAccount.address,
            },
          }
        : undefined;

      const grantsToBuild = _.uniq([...grants, ...grantsToRequest]);

      const basicAllowance: BasicAllowance = {
        spendLimit: [], // This is empty so that there are no limits
        expiration: undefined, // This is null so that the allowance will never expire
      };

      const allowance: AllowedMsgAllowance = {
        allowance: Any.fromPartial({
          typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
          value: BasicAllowance.encode(basicAllowance).finish(),
        }),
        allowedMessages: grantsToBuild,
      };

      const msgGrantAllowanceEncode: MsgGrantAllowanceEncodeObject = {
        typeUrl: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
        value: {
          granter: butterConfig.desmos_address,
          grantee: chainAccount.address,
          allowance: {
            typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
            value: AllowedMsgAllowance.encode(allowance).finish(),
          },
        },
      };

      const msgsGrantEncodes: MsgGrantEncodeObject[] = grantsToBuild.map(
        grant => ({
          typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
          value: {
            granter: butterConfig.desmos_address,
            grantee: chainAccount.address,
            grant: {
              authorization: grant,
              expiration: undefined,
            },
          },
        }),
      );

      console.log(
        msgsGrantEncodes,
        msgGrantAllowanceEncode,
        msgRevokeAllowanceEncode,
      );
    },
    [],
  );

  const createAndBroadcastAuthGrant = React.useCallback(
    async ({
      scope,
      onSuccess,
      onFailure,
    }: {
      scope: GrantEnums;
      onSuccess?: () => void;
      onFailure?: () => void;
    }) => {
      if (!chainAccount) return;

      const grantMsg = createAuthMsgEncode({
        chainAccount,
        scope,
        granteeAddress,
      });

      const wallet = await unlockWallet(chainAccount);

      const {fee} = computeGasAndFees({
        msg: [grantMsg],
        denom: EnvConfig.BASE_DENOM,
      });

      const broadcastResult = await broadcastMessages(
        wallet as OfflineSigner,
        [grantMsg],
        fee.average,
      );

      if (broadcastResult) {
        onSuccess && onSuccess();
      } else {
        onFailure && onFailure();
      }
    },
    [chainAccount],
  );

  return {
    createAndBroadcastAuthGrant,
    // expose the async loading of ChainAccounts so it can be used
    // to block/disable input before the data is fully loaded¬
    accountsLoading: loading,
    requestAndUpdateGrants,
  };
};

export default useCreateAuthGrant;
