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

  /**
   * Should broadcast the tx under optimistic mode?
   * Only for Relationships and Reactions
   */
  optimistic?: boolean;
};

/**
 * Authenticated response - requires a valid auth token
 */
const CentralizedBroadcastTx = async ({
  messages,
  memo,
  optimistic,
}: Params): Promise<Response> => {
  const _response = await axiosInstance.post(
    optimistic ? '/broadcast?optimistic=true' : '/broadcast',
    {
      messages,
      memo,
    },
  );
  return _response.data;
};

export const encodeAndBroadcastTx = async ({
  msgs,
  memo,
  optimistic,
}: {
  msgs: EncodeObject[];
  memo?: string;
  optimistic?: boolean;
}): Promise<Response> => {
  const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
  const aminoEncodedMsg = client.encodeToAmino(msgs);
  client.disconnect();

  return CentralizedBroadcastTx({
    messages: aminoEncodedMsg,
    memo,
    optimistic,
  });
};

export default CentralizedBroadcastTx;
