import { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { safeParseFloat } from 'lib/FormatUtils';
import { Coin } from '@cosmjs/stargate';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import useBroadcastTx from 'hooks/transactions/useBroadcastTx';
import { Tip, TipTarget, TipTargetType } from 'types/tips';
import { useDeleteStoredTip, useStoreTip } from '@recoil/tips';
import { DataStatus } from 'types/cache';
import { useActiveProfile } from '@recoil/profiles';

/**
 * Returns the target to be used within a <code>MsgExecuteContract</code> when sending a tip.
 * @param target {TipTarget} - Target of the tip for which to get the data.
 */
export const getMsgTipTarget = (target: TipTarget): any => {
  switch (target.type) {
    case TipTargetType.POST:
      return {
        content_target: {
          post_id: target.post.id.toString(),
        },
      };

    case TipTargetType.USER:
      return {
        user_target: {
          receiver: target.user.address,
        },
      };
  }
};

/**
 * Hook that allows to send the tip to any of the supported targets.
 */
const useSendTip = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to send a tip without having an active account');
  }

  const activeProfile = useActiveProfile();
  if (!activeProfile) {
    throw new Error('Trying to send a tip without having an active profile');
  }

  const subspaceParams = useAppStateValue('subspaceParams');
  const tipsContractAddress = subspaceParams.tipsContractConfig?.address ?? '';
  const tipPercentage = subspaceParams.tipsContractConfig?.serviceFeePercentage ?? 0;

  const storeTip = useStoreTip(activeAddress);
  const deleteStoredTip = useDeleteStoredTip(activeAddress);

  const broadcastTx = useBroadcastTx();

  return useCallback(
    async (tipData: Pick<Tip, 'target' | 'amount'>) => {
      // Build the tip
      const tip: Tip = {
        target: tipData.target,
        amount: tipData.amount,
        sender: activeProfile,
        status: DataStatus.CREATED_LOCALLY,
        creationDate: new Date(Date.now()).toISOString(),
        lastEdited: new Date(Date.now()).toISOString(),
      };

      // Store the tip locally
      storeTip(tip);

      // Compute the fee amount
      const fees = tip.amount.map(
        coin =>
          ({
            denom: coin.denom,
            amount: ((safeParseFloat(coin.amount) * tipPercentage) / 100).toString(),
          } as Coin),
      );

      // Build the message
      const msg: MsgExecuteContractEncodeObject = {
        typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
        value: {
          sender: activeAddress,
          contract: tipsContractAddress,
          funds: fees,
          msg: toUtf8(
            JSON.stringify({
              send_tip: {
                amount: tip.amount,
                target: getMsgTipTarget(tip.target),
              },
            }),
          ),
        },
      };

      // Send the transaction
      const result = await broadcastTx([msg]);
      if (result.isErr()) {
        // If the sending was not successful, delete the tip
        deleteStoredTip(tip);
      }

      return result;
    },
    [
      activeAddress,
      activeProfile,
      broadcastTx,
      deleteStoredTip,
      storeTip,
      tipPercentage,
      tipsContractAddress,
    ],
  );
};

export default useSendTip;
