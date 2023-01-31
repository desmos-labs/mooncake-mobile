import React from 'react';
import {EncodeObject} from '@cosmjs/proto-signing';

export interface BroadcastOptions {
  /**
   * Whether the transaction should be broadcast using the optimistic APIs or not.
   */
  readonly optimistic?: boolean;
  /**
   * Memo to be used when broadcasting the transaction.
   */
  readonly memo?: string;
  /**
   * Callback that is used when the transaction broadcast is successful.
   */
  readonly onSuccess?: (result: BroadcastResult) => void;
  /**
   * Callback used when the transaction broadcast is canceled by the user.
   */
  readonly onCancel?: () => void;
  /**
   * Callback used when the transaction broadcast fails for any reason.
   */
  readonly onError?: (error: Error) => void;
}

export interface BroadcastResult {
  readonly txHash: string;
}

/**
 * Hook that allows to broadcast a transaction.
 *
 * If the user is using a wallet that has granted the centralized APIs the permission to sign on their behalf,
 * then the transaction will be broadcast using those APIs without requiring the user to manually authenticate
 * anything.
 *
 * If the user is using a wallet that has <b>not</b> granted the permission to sign on their behalf,
 * then they should be taken to the transaction authentication flow where they will have to manually confirm the
 * transaction.
 */
const useBroadcastTx = () => {
  // TODO: Create useUnlockWallet hook to unlock the wallet, if needed

  return React.useCallback(
    async (msgs: EncodeObject[], options?: BroadcastOptions) => {
      console.log('Implement useBroadcastTx', msgs, options);
    },
    [],
  );
};

export default useBroadcastTx;
