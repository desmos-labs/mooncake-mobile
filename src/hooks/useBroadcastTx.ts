import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import useBroadcastTxOnChain from 'hooks/useBroadcastTxOnChain';
import useBroadcastTxWithApi from 'hooks/useBroadcastTxWithApi';
import { err, ok, Result } from 'neverthrow';
import { CanceledOperationError } from 'types/error';

export interface BroadcastOptions {
  /**
   * Whether the transaction should be broadcast using the optimistic APIs or not,
   * if undefined will be considered false.
   */
  readonly optimistic?: boolean;
  /**
   * Whether the transaction should be broadcast directly on chain,
   * if undefined will be considered false.
   */
  readonly onChain?: boolean;
  /**
   * Memo to be used when broadcasting the transaction.
   */
  readonly memo?: string;
}

export interface SuccessfulBroadcast {
  readonly txHash: string;
}

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
 * cancels the broadcasting, a {@link CanceledOperationError} will be returned.
 */
const useBroadcastTx = () => {
  const broadcastTxOnChain = useBroadcastTxOnChain();
  const broadcastTxWithApi = useBroadcastTxWithApi();

  return React.useCallback(
    async (
      msgs: EncodeObject[],
      options?: BroadcastOptions,
    ): Promise<Result<SuccessfulBroadcast, Error>> => {
      return new Promise(resolve => {
        if (options?.onChain === true) {
          broadcastTxOnChain(msgs, {
            memo: options?.memo,
            onSuccess: txResponse => {
              resolve(
                ok({
                  txHash: txResponse.transactionHash,
                }),
              );
            },
            onCancel: () => {
              resolve(err(new CanceledOperationError()));
            },
          });
        } else {
          broadcastTxWithApi(msgs, {
            optimistic: options?.optimistic,
            memo: options?.memo,
          })
            .then(result => {
              if (result.isOk()) {
                resolve(
                  ok({
                    txHash: result.value.txHash,
                  }),
                );
              } else {
                resolve(err(result.error));
              }
            })
            .catch(e => resolve(err(Error(e?.message ?? 'Tx with api failed'))));
        }
      });
    },
    [broadcastTxOnChain, broadcastTxWithApi],
  );
};

export default useBroadcastTx;
