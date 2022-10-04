import axiosInstance from 'services/axios';
import {AminoMsg} from '@cosmjs/amino';

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

export default CentralizedBroadcastTx;
