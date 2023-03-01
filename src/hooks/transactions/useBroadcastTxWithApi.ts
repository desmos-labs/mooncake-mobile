import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { AminoTypes } from '@cosmjs/stargate';
import { createDesmosTypes } from '@desmoslabs/desmjs';
import axiosInstance from 'services/axios';
import { errAsync, ok, ResultAsync } from 'neverthrow';
import { useAppStateValue } from '@recoil/appState';
import { PendingTransaction } from 'types/transactions';
import { useStorePendingTransaction } from '@recoil/transactions';
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

export interface BroadcastTxWithApiResponse {
  /**
   * Hash of the broadcasted transaction.
   */
  txHash: string;
}

/**
 * Posts a transaction to the centralized APIs.
 * @param token The bearer token to use to authenticate the request
 * @param messages The messages to include in the transaction
 * @param options The options to use to broadcast the transaction
 */
const postTransaction = (
  token: string,
  messages: AminoMsg[],
  options?: BroadcastTxWithApiOptions,
) => {
  axiosInstance.defaults.headers.common = { Authorization: `Bearer ${token}` };
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

  const token = useAppStateValue('bearerToken');
  const storePendingTransaction = useStorePendingTransaction();

  return React.useCallback(
    (
      messages: EncodeObject[],
      options?: BroadcastTxWithApiOptions,
    ): ResultAsync<BroadcastTxWithApiResponse, Error> => {
      if (!activeAccountAddress) {
        return errAsync(new Error('Trying to broadcast a transaction without active account'));
      }

      const aminoEncoder = new AminoTypes(createDesmosTypes('desmos'));
      const aminoMessages = messages.map(msg => aminoEncoder.toAmino(msg));

      return ResultAsync.fromPromise(
        postTransaction(token, aminoMessages, options),
        (e: any) => new Error(e?.message ?? 'Error broadcasting the transaction'),
      )
        .map(response => ({ txHash: response.data.tx_hash }))
        .andThen(result => {
          // Store the transaction locally
          const transaction: PendingTransaction = {
            messages,
            fees: [],
            hash: result.txHash,
            timestamp: new Date().toISOString(),
            user: activeAccountAddress,
          };
          storePendingTransaction(activeAccountAddress, transaction);

          // Return the original result
          return ok(result);
        });
    },
    [activeAccountAddress, storePendingTransaction, token],
  );
};

export default useBroadcastTxWithApi;
