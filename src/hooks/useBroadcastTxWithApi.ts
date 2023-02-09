import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoTypes } from '@cosmjs/stargate';
import { createDesmosTypes } from '@desmoslabs/desmjs/src/aminomessages';
import axiosInstance from 'services/axios';
import { Result, ResultAsync } from 'neverthrow';
import { useAppStateValue } from '@recoil/appState';

interface AxiosResponse {
  tx_hash: string;
}

export interface BroadcastTxWithApiOptions {
  /**
   * Tells if the transaction should be handled optimistically.
   */
  optimistic?: boolean;
  /**
   * Transaction memo.
   */
  memo?: string;
}

export interface BroadcastTxWithApiResponse {
  /**
   * Hash of the broadcasted transaction.
   */
  txHash: string;
}

const useBroadcastTxWithApi = () => {
  const token = useAppStateValue('bearerToken');

  return React.useCallback(
    async (
      messages: EncodeObject[],
      options?: BroadcastTxWithApiOptions,
    ): Promise<Result<BroadcastTxWithApiResponse, Error>> => {
      const aminoEncoder = new AminoTypes(createDesmosTypes('desmos'));
      const aminoMessages = messages.map(msg => aminoEncoder.toAmino(msg));

      axiosInstance.defaults.headers.common = {
        Authorization: `Bearer ${token}`,
      };

      return ResultAsync.fromPromise(
        axiosInstance.post<AxiosResponse>(
          options?.optimistic ? '/broadcast?optimistic=true' : '/broadcast',
          {
            messages: aminoMessages,
            memo: options?.memo,
          },
        ),
        // @ts-ignore
        e => new Error(e?.message ?? 'Error broadcasting the transaction'),
      ).map(response => ({ txHash: response.data.tx_hash }));
    },
    [token],
  );
};

export default useBroadcastTxWithApi;
