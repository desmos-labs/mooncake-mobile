import { Coin } from '@cosmjs/stargate';
import { MsgExecuteContractEncodeObject } from '@cosmjs/cosmwasm-stargate';
import { GrantEnums } from 'lib/desmos/msgtypes';
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import { toUtf8 } from '@cosmjs/encoding';

export const buildPostTipMsg = ({
  amount,
  fee,
  sender,
  postId,
  contractAddress,
}: {
  amount: Coin[];
  fee: Coin[];
  sender: string;
  postId: number;
  contractAddress: string;
}): MsgExecuteContractEncodeObject => {
  return {
    typeUrl: GrantEnums.MsgExecuteContract,
    value: MsgExecuteContract.fromPartial({
      sender,
      contract: contractAddress,
      msg: toUtf8(
        JSON.stringify({
          send_tip: {
            amount,
            target: {
              content_target: {
                post_id: postId.toString(),
              },
            },
          },
        }),
      ),
      funds: fee,
    }),
  };
};

export const buildUserTipMsg = ({
  amount,
  fee,
  sender,
  receiver,
  contractAddress,
}: {
  amount: Coin[];
  fee: Coin[];
  sender: string;
  receiver: string;
  contractAddress: string;
}): MsgExecuteContractEncodeObject => {
  return {
    typeUrl: GrantEnums.MsgExecuteContract,
    value: MsgExecuteContract.fromPartial({
      sender,
      contract: contractAddress,
      msg: toUtf8(
        JSON.stringify({
          send_tip: {
            amount,
            target: {
              user_target: {
                receiver,
              },
            },
          },
        }),
      ),
      funds: fee,
    }),
  };
};

export const numberToPlainCoin = (amount: number, denom: string) => {
  return {
    denom,
    amount: (amount * 1000000).toFixed(0).toString(),
  } as Coin;
};
