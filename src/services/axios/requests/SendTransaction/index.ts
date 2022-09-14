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
};

/**
 * Authenticated response - requires a valid auth token
 */
const SendTransaction = async ({messages}: Params): Promise<Response> => {
  const _response = await axiosInstance.post('/transaction', {messages});

  return _response.data;
};

export default SendTransaction;
