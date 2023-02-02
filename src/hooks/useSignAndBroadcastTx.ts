import React from 'react';
import { AccountWithWallet } from 'types/account';
import { EncodeObject } from '@cosmjs/proto-signing';
import { ok, Result } from 'neverthrow';

/**
 * Represents the type that is returned when a sign and broadcast
 * of a transaction is successful.
 */
export interface SignAndBroadcastSuccess {
  /**
   * Hash of the transaction that has been broadcast.
   */
  readonly txHash: string;
}

/**
 * Represents the various types of errors that can be raised while
 * signing and broadcasting a transaction.
 */
export enum SignAndBroadcastErrorType {
  TIMEOUT,
  TX_ERROR,
}

/**
 * Represents the fact taht the sign and broadcast has timed out.
 */
interface SignAndBroadcastTimeout extends Error {
  readonly type: SignAndBroadcastErrorType.TIMEOUT;
}

/**
 * Represents a generic error during the sign and broadcast of the transaction.
 */
interface SignAndBroadcastTxError extends Error {
  readonly type: SignAndBroadcastErrorType.TX_ERROR;
  readonly error: string;
}

export interface SignAndBroadcastOptions {
  /**
   * Whether to use the optimistic APIs to broadcast the transaction.
   * This is going to be used only if the user has previously granted
   * the authorization to the APIs.
   */
  readonly useOptimisticAPIs?: boolean;
  /**
   * Optional memo to be associated with the message.
   */
  readonly memo?: string;
  /**
   * Optional timeout to be set during the signing and broadcast of
   * the transaction (default: 30 seconds).
   */
  readonly timeout?: number;
}

/**
 * Represents all the possible error types that can be raised during
 * the signing and broadcasting of a transaction.
 */
export type SignAndBroadcastError = SignAndBroadcastTimeout | SignAndBroadcastTxError;

/**
 * Hook that allows to sign and broadcast a transaction given an account
 * and the provided transaction.
 */
const useSignAndBroadcastTx = () => {
  return React.useCallback(
    async (
      account: AccountWithWallet,
      messages: EncodeObject[],
      options?: SignAndBroadcastOptions,
    ): Promise<Result<SignAndBroadcastSuccess, SignAndBroadcastError>> => {
      // TODO: Implement this method
      return ok({ txHash: '' });
    },
    [],
  );
};

export default useSignAndBroadcastTx;
