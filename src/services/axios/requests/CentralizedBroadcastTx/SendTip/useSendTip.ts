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
 * Hook that manange a report
 */
const useSendTip = () => {
  const {activeAddress} = useActiveAccount();
  const [sendTipLoading, setSendTipLoading] = React.useState(false);

  const sendTip = React.useCallback(
    async ({
      amount,
      sender,
      receiver,
      message,
    }: {
      amount: Coin[];
      sender: string;
      receiver: string;
      message?: string;
    }) => {
      if (!activeAddress) return;
      console.log(message);
      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
        const msg: MsgExecuteContractEncodeObject = {
          typeUrl: GrantEnums.MsgExecuteContract,
          value: MsgExecuteContract.fromPartial({
            sender,
            contract:
              'desmos1fuyxwxlsgjkfjmxfthq8427dm2am3ya3cwcdr8gls29l7jadtazsh8p7x5',
            // json utf8
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
            funds: [],
          }),
        };
        console.log('msg', msg);

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [activeAddress],
  );

  /**
   * @param {number} postId The ID of the post
   * @param {string} user The address of the user managing the report
   * @param {number[]} reasonsIds IDs of the reasons related to the report
   * @param {string} message Optional message
   * */
  const manageTips = useCallback(
    async ({
      amount,
      sender,
      receiver,
      message,
    }: {
      amount: Coin[];
      sender: string;
      receiver: string;
      message?: string;
    }) => {
      setSendTipLoading(true);
      let result;
      try {
        result = await sendTip({amount, sender, receiver, message});
      } catch (err: any) {
        throw new Error(err.toString());
      } finally {
        setSendTipLoading(false);
        console.log(result);
      }
    },
    [sendTip],
  );

  return {manageTips, sendTipLoading};
};

export default useSendTip;
