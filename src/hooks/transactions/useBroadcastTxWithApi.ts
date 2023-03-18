import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoTypes } from '@cosmjs/stargate';
import { createDesmosTypes } from '@desmoslabs/desmjs';
import axiosInstance from 'services/axios';
import { errAsync, ResultAsync } from 'neverthrow';
import { PendingTransaction } from 'types/transactions';
import { useActiveAccountAddress } from '@recoil/accounts';
import { AminoMsg } from '@cosmjs/amino';

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

/**
 * Posts a transaction to the centralized APIs.
 * @param messages The messages to include in the transaction
 * @param options The options to use to broadcast the transaction
 */
const postTransaction = (messages: AminoMsg[], options?: BroadcastTxWithApiOptions) => {
  return axiosInstance.post<AxiosResponse>(
    options?.optimistic ? '/broadcast?optimistic=true' : '/broadcast',
    {
      messages,
      memo: options?.memo,
    },
  );
};

/**
 * Hook that broadcasts a transaction using the centralized APIs.
 */
const useBroadcastTxWithApi = () => {
  const activeAccountAddress = useActiveAccountAddress();
  return React.useCallback(
    (
      messages: EncodeObject[],
      options?: BroadcastTxWithApiOptions,
    ): ResultAsync<PendingTransaction, Error> => {
      if (!activeAccountAddress) {
        return errAsync(new Error('Trying to broadcast a transaction without active account'));
      }

      const aminoEncoder = new AminoTypes(createDesmosTypes());
      const aminoMessages = messages.map(msg => aminoEncoder.toAmino(msg));

      return ResultAsync.fromPromise(
        postTransaction(aminoMessages, options),
        (e: any) => new Error(e?.message ?? 'Error broadcasting the transaction'),
      )
        .map(response => ({ txHash: response.data.tx_hash }))
        .map(result => {
          return {
            messages,
            fees: [],
            hash: result.txHash,
            timestamp: new Date().toISOString(),
            user: activeAccountAddress,
          } as PendingTransaction;
        });
    },
    [activeAccountAddress],
  );
};

export default useBroadcastTxWithApi;
