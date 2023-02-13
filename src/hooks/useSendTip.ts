import { useCallback } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { safeParseFloat } from 'lib/FormatUtils';
import { Coin } from '@cosmjs/stargate';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { toUtf8 } from '@cosmjs/encoding';
import useBroadcastTx from 'hooks/useBroadcastTx';

interface Tip {
  readonly amount: Coin[];
}

export enum TipTargetType {
  POST,
  USER,
}

export interface PostTipTarget extends Tip {
  readonly type: TipTargetType.POST;
  readonly postId: number;
}

export interface UserTipTarget extends Tip {
  readonly type: TipTargetType.USER;
  readonly address: string;
}

export type TipTarget = PostTipTarget | UserTipTarget;

/**
 * Returns the target to be used within a <code>MsgExecuteContract</code> when sending a tip.
 * @param target {TipTarget} - Target of the tip for which to get the data.
 */
export const getMsgTipTarget = (target: TipTarget): any => {
  switch (target.type) {
    case TipTargetType.POST:
      return {
        content_target: {
          post_id: target.postId.toString(),
        },
      };

    case TipTargetType.USER:
      return {
        user_target: {
          receiver: target.address,
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

  const subspaceParams = useAppStateValue('subspaceParams');
  const tipsContractAddress = subspaceParams.tipsContractConfig?.address ?? '';
  const tipPercentage = subspaceParams.tipsContractConfig?.serviceFeePercentage ?? 0;

  const broadcastTx = useBroadcastTx();

  return useCallback(
    (target: TipTarget) => {
      // Compute the fee amount
      const fees = target.amount.map(
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
                amount: target.amount,
                target: getMsgTipTarget(target),
              },
            }),
          ),
        },
      };

      // Send the transaction
      return broadcastTx([msg]);
    },
    [activeAddress, broadcastTx, tipPercentage, tipsContractAddress],
  );
};

export default useSendTip;
