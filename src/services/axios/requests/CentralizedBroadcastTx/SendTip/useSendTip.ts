import {MsgExecuteContractEncodeObject} from '@cosmjs/cosmwasm-stargate';
import {toUtf8} from '@cosmjs/encoding';
import {Coin} from '@cosmjs/stargate';
import {DesmosClient} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import {MsgExecuteContract} from 'cosmjs-types/cosmwasm/wasm/v1/tx';
import useActiveAccount from 'hooks/useActiveAccount';
import {GrantEnums} from 'lib/desmos/msgtypes';
import React, {useCallback} from 'react';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that manange tips
 */
const useSendTip = () => {
  const {activeAddress} = useActiveAccount();
  const [sendTipLoading, setSendTipLoading] = React.useState(false);

  const sendTipToPost = React.useCallback(
    async ({
      amount,
      fee,
      sender,
      message,
      postId,
    }: {
      amount: Coin[];
      fee: Coin[];
      sender: string;
      message?: string;
      postId: number;
    }) => {
      if (!activeAddress) return;
      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
        const msg: MsgExecuteContractEncodeObject = {
          typeUrl: GrantEnums.MsgExecuteContract,
          value: MsgExecuteContract.fromPartial({
            sender,
            contract:
              'desmos1fuyxwxlsgjkfjmxfthq8427dm2am3ya3cwcdr8gls29l7jadtazsh8p7x5',
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
        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
          memo: message,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [activeAddress],
  );

  const sendTipToUser = React.useCallback(
    async ({
      amount,
      fee,
      sender,
      message,
      receiver,
    }: {
      amount: Coin[];
      fee: Coin[];
      sender: string;
      message?: string;
      receiver: string;
    }) => {
      if (!activeAddress) return;
      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
        const msg: MsgExecuteContractEncodeObject = {
          typeUrl: GrantEnums.MsgExecuteContract,
          value: MsgExecuteContract.fromPartial({
            sender,
            contract:
              'desmos1fuyxwxlsgjkfjmxfthq8427dm2am3ya3cwcdr8gls29l7jadtazsh8p7x5',
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
        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
          memo: message,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [activeAddress],
  );

  /**
   * @param {Coin[]} amount The amount object, a single value inside an array
   * @param {Coin[]} fee The fee object, a single value inside an array
   * @param {string} sender The address of the sender
   * @param {string} receiver (OPTIONAL only if sending tips to an user) The address of the receiver
   * @param {string} message (OPTIONAL) A message to send with the tip (will be stored as a MEMO)
   * @param {number} postId (OPTIONAL only if sending tips to a post) The id of the post
   * */
  const manageTips = useCallback(
    async ({
      amount,
      fee,
      sender,
      receiver,
      message,
      postId,
    }: {
      amount: Coin[];
      fee: Coin[];
      sender: string;
      receiver?: string;
      message?: string;
      postId?: number;
    }) => {
      setSendTipLoading(true);
      let result;
      try {
        if (postId) {
          result = await sendTipToPost({
            amount,
            sender,
            message,
            fee,
            postId,
          });
        } else if (receiver) {
          result = await sendTipToUser({
            amount,
            sender,
            receiver,
            message,
            fee,
          });
        }
      } catch (err: any) {
        throw new Error(err.toString());
      } finally {
        setSendTipLoading(false);
        console.log(result);
      }
    },
    [sendTipToPost, sendTipToUser],
  );

  return {manageTips, sendTipLoading};
};

export default useSendTip;
