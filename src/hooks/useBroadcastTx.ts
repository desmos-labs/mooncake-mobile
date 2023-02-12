import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { ok, Result } from 'neverthrow';

export interface BroadcastOptions {
  /**
   * Whether the transaction should be broadcast using the optimistic APIs or not.
   */
  readonly optimistic?: boolean;
  /**
   * Memo to be used when broadcasting the transaction.
   */
  readonly memo?: string;
}

export interface SuccessfulBroadcast {
  readonly txHash: string;
}

export class CanceledBroadcastError extends Error {
  readonly type: 'CanceledBroadcastError';

  constructor(message: string) {
    super(message);
    this.type = 'CanceledBroadcastError';
  }
}

export const isCanceledBroadcastError = (e: Error): boolean => {
  const { type } = e as CanceledBroadcastError;
  return type === 'CanceledBroadcastError';
};

/**
 * Hook that allows to broadcast a transaction by going through the various UI based on the user's wallet type.
 *
 * If the user is using a wallet that has granted the centralized APIs the permission to sign on their behalf,
 * then the transaction will be broadcast using those APIs without requiring the user to manually authenticate
 * anything.
 *
 * If the user is using a wallet that has <b>not</b> granted the permission to sign on their behalf,
 * then they will be taken to the transaction authentication flow where they will have to manually confirm the
 * transaction. This flow will vary based on the wallet type the user is using (mnemonic, Ledger, Web3Auth, etc).
 *
 * @return a {@link Result} that can either be a {@link SuccessfulBroadcast} or an {@link Error}. If the user
 * cancels the broadcasting, a {@link CanceledBroadcastError} will be returned.
 */
const useBroadcastTx = () => {
  // TODO: Create useUnlockWallet hook to unlock the wallet, if needed

  return React.useCallback(
    async (
      msgs: EncodeObject[],
      options?: BroadcastOptions,
    ): Promise<Result<SuccessfulBroadcast, Error>> => {
      console.log('Implement useBroadcastTx', msgs, options);
      return ok({ txHash: '' });
    },
    [],
  );
};

export default useBroadcastTx;
