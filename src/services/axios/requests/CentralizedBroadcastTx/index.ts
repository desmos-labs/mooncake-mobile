import React from 'react';
import axiosInstance from 'services/axios';
import {AminoMsg} from '@cosmjs/amino';
import {EncodeObject} from '@cosmjs/proto-signing';
import {DesmosClient} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';

type Response = {
  tx_hash: string;
};

type Params = {
  /**
   * Amino encoded messages to send
   */
  messages: AminoMsg[];
  /**
   * Memo message (Optional)
   */
  memo?: string;
};

/**
 * Authenticated response - requires a valid auth token
 */
const CentralizedBroadcastTx = async ({
  messages,
  memo,
}: Params): Promise<Response> => {
  const _response = await axiosInstance.post('/broadcast', {messages, memo});
  return _response.data;
};

export const useCentralizedBroadcastTx = () => {
  const encodeAndBroadcastTx = React.useCallback(
    async ({msgs, memo}: {msgs: EncodeObject[]; memo?: string}) => {
      const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

      const aminoEncodedMsg = client.encodeToAmino(msgs);

      return CentralizedBroadcastTx({
        messages: aminoEncodedMsg,
        memo,
      });
    },
    [],
  );

  return {encodeAndBroadcastTx};
};

export const encodeAndBroadcastTx = async ({
  msgs,
  memo,
}: {
  msgs: EncodeObject[];
  memo?: string;
}): Promise<Response> => {
  const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
  const aminoEncodedMsg = client.encodeToAmino(msgs);
  client.disconnect();
  return CentralizedBroadcastTx({
    messages: aminoEncodedMsg,
    memo,
  });
};

export default CentralizedBroadcastTx;
