import React from 'react';
import axiosInstance from 'services/axios';
import {AminoMsg} from '@cosmjs/amino';
import useActiveAccount from 'hooks/useActiveAccount';
import useAuthenticatedAPIRequest from 'hooks/useAuthenticatedAPIRequest';

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
 * @deprecated Use useCentralizedBroadcastTx if possible.
 */
const CentralizedBroadcastTx = async ({
  messages,
}: Params): Promise<Response> => {
  const _response = await axiosInstance.post('/broadcast', {messages});

  return _response.data;
};

/**
 * A hook that wraps the CentralizedBroadcastTx logic
 */
export const useCentralizedBroadcastTx = () => {
  const {activeAddress} = useActiveAccount();
  const authenticatedRequest = useAuthenticatedAPIRequest();

  const centralizedBroadcastTx = React.useCallback(
    async (params: Params) => {
      if (!activeAddress) {
        return console.log('[CentralizedBroadcastTx] No active address found');
      }
      const {messages} = params;

      return authenticatedRequest({
        request: () => CentralizedBroadcastTx({messages}),
      });
    },
    [activeAddress, CentralizedBroadcastTx],
  );

  return {
    centralizedBroadcastTx,
  };
};

export default CentralizedBroadcastTx;
