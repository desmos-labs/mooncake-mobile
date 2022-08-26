import React from 'react';
import {useButterConfig} from '@recoil/butterConfigState';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useActiveAccount from 'hooks/useActiveAccount';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useBroadcastMessages from 'hooks/broadcastTx/useBroadcastMessages';
import {computeGasAndFees} from 'lib/desmos/fees';
import EnvConfig from 'config/EnvConfig';
import {OfflineSigner} from '@cosmjs/proto-signing';
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

  const granteeAddress = React.useMemo(() => {
    return butterConfig.desmos_address;
  }, [butterConfig.desmos_address]);

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
  };
};

export default useCreateAuthGrant;
