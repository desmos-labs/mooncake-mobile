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
  buildMessageGrantAllowance,
  buildRevokeFeeGrantMsg,
} from 'lib/MsgGrantUtils';
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
      const revokeGrantMsg = has_fee_grant
        ? buildRevokeFeeGrantMsg({
            grantee: chainAccount.address,
            granter: butterConfig.desmos_address,
          })
        : undefined;

      const feeGrantMsg = buildMessageGrantAllowance({
        granter: butterConfig.desmos_address,
        grantee: chainAccount.address,
        grants: _.uniq([...grants, ...grantsToRequest]),
      });

      console.log(revokeGrantMsg, feeGrantMsg);
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
