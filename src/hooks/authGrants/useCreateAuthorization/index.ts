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
import {Grant} from 'cosmjs-types/cosmos/authz/v1beta1/authz';
import {GenericSubspaceAuthorization} from '@desmoslabs/desmjs-types/desmos/subspaces/v3/authz/authz';
import Long from 'long';

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
              grantee: butterConfig.desmos_address,
              granter: chainAccount.address,
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
          grantee: butterConfig.desmos_address,
          granter: chainAccount.address,
          allowance: Any.fromPartial({
            typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
            value: AllowedMsgAllowance.encode(allowance).finish(),
          }),
        },
      };

      const msgsGrantEncodes: MsgGrantEncodeObject[] = grantsToBuild.map(
        grant => {
          const subspaceAuthorization: GenericSubspaceAuthorization = {
            subspacesIds: [Long.fromNumber(5)], // 5 is our app's subspace id
            msg: grant,
          };

          const _grant: Grant = {
            authorization: Any.fromPartial({
              typeUrl:
                '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
              value: GenericSubspaceAuthorization.encode(
                subspaceAuthorization,
              ).finish(),
            }),
          };

          return {
            typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
            value: {
              grantee: butterConfig.desmos_address,
              granter: chainAccount.address,
              grant: _grant,
            },
          };
        },
      );

      const unlockResult = await unlockWallet(chainAccount);

      if (!unlockResult) {
        throw new Error(
          'Error unlocking wallet or user cancelled authetication',
        );
      }

      const {wallet} = unlockResult;

      const combinedMessages = _.compact([
        msgRevokeAllowanceEncode as any,
        msgGrantAllowanceEncode,
        ...msgsGrantEncodes,
      ]);

      const {fee} = computeGasAndFees({
        msg: combinedMessages,
        denom: EnvConfig.BASE_DENOM,
      });

      const broadcastResult = await broadcastMessages(
        wallet as OfflineSigner,
        combinedMessages,
        fee.average,
      );

      console.log(broadcastResult);
    },
    [chainAccount],
  );

  return {
    // expose the async loading of ChainAccounts so it can be used
    // to block/disable input before the data is fully loaded¬
    accountsLoading: loading,
    requestAndUpdateGrants,
  };
};

export default useCreateAuthGrant;
