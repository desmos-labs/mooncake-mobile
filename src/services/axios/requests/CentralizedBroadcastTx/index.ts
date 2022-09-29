import React from 'react';
import axiosInstance from 'services/axios';
import {AminoMsg} from '@cosmjs/amino';
import _ from 'lodash';
import useActiveAccount from 'hooks/useActiveAccount';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';

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
const CentralizedBroadcastTx = async ({
  messages,
}: Params): Promise<Response> => {
  const _response = await axiosInstance.post('/broadcast', {messages});

  return _response.data;
};

const invalidAuthMsgs = ['Wrong Authorization header value', 'Invalid Token'];

/**
 * A hook that wraps the CentralizedBroadcastTx logic
 */
export const useCentralizedBroadcastTx = () => {
  const {activeAddress} = useActiveAccount();
  const {navigate, pop} = useNavigation<any>();

  const centralizedBroadcastTx = React.useCallback(
    async (params: Params) => {
      if (!activeAddress) {
        return console.log('[CentralizedBroadcastTx] No active address found');
      }
      const {messages} = params;

      try {
        const response = await CentralizedBroadcastTx({messages});

        return response;
      } catch (err: any) {
        const responseMsg = _.get(err, 'response.data');
        console.log(responseMsg);
        if (invalidAuthMsgs.includes(responseMsg)) {
          navigate(ROUTES.LOGIN, {
            onSuccess: () => {
              pop();
            },
          });
        }
      }
    },
    [activeAddress, CentralizedBroadcastTx],
  );

  return {
    centralizedBroadcastTx,
  };
};

export default CentralizedBroadcastTx;
