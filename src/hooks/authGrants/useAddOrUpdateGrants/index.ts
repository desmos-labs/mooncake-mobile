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
import {MsgRevokeAllowanceEncodeObject} from '@desmoslabs/desmjs';
import {
  buildGrantAllowanceEncode,
  buildGrantMsgEncodes,
  buildRevokeAllowanceEncode,
} from 'hooks/authGrants/useAddOrUpdateGrants/utils';

/**
 * MVP msg authorizations
 * post
 * add reaction
 * remove reaction
 * follow user
 * unfollow user
 * report content
 */

const useAddOrUpdateGrants = () => {
  const {butterConfig} = useButterConfig();
  const {chainAccount, loading} = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const broadcastMessages = useBroadcastMessages();
  const {getActiveGrants} = useGetActiveGrants();

  /**
   * All-in-one function that builds and broadcast a transaction as part of the
   * Granting Authorization flows outlined in the @link below.
   * @link https://forbole.atlassian.net/wiki/spaces/DOG/pages/29786120/Managing+actions+authorizations#Granting-authorizations
   * @param {GrantEnums[]} grantsToRequest - An array of grants to request.
   */
  const addOrUpdateGrants = React.useCallback(
    async ({grantsToRequest}: {grantsToRequest: GrantEnums[]}) => {
      if (!chainAccount) throw new Error('No active chain account found.');
      const grantsData = await getActiveGrants();

      const {grants: existingGrants, has_fee_grant} = grantsData;

      if (_.difference(grantsToRequest, existingGrants).length === 0) return;

      const grantee = butterConfig.desmos_address;
      const granter = chainAccount.address;
      const grants = _.uniq([...existingGrants, ...grantsToRequest]);

      /**
       * If user already has a fee grant, we need to revoke it by creating a MsgRevokeallowanceEncodeObject
       * Otherwise, do nothing.
       */
      const msgRevokeAllowanceEncode:
        | MsgRevokeAllowanceEncodeObject
        | undefined = has_fee_grant
        ? buildRevokeAllowanceEncode({
            grantee,
            granter,
          })
        : undefined;

      const msgGrantAllowanceEncode = buildGrantAllowanceEncode({
        grants,
        grantee,
        granter,
      });

      const msgsGrantEncodes = buildGrantMsgEncodes({grants, grantee, granter});

      const unlockResult = await unlockWallet(chainAccount);

      if (!unlockResult) {
        throw new Error(
          'Error unlocking wallet or user cancelled authentication',
        );
      }

      const {wallet} = unlockResult;

      // compact to remove undefined message, as msgRevokeAllowanceEncode is undefined
      // if user does not have a fee grant
      const combinedMessages = _.compact([
        msgRevokeAllowanceEncode,
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

      if (!broadcastResult) {
        throw new Error('Error requesting grants');
      }

      return true;
    },
    [chainAccount, butterConfig],
  );

  return {
    // expose the async loading of ChainAccounts so it can be used
    // to block/disable input before the data is fully loaded¬
    accountsLoading: loading,
    addOrUpdateGrants,
  };
};

export default useAddOrUpdateGrants;
