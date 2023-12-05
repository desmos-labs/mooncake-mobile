import React from 'react';
import { err, ResultAsync } from 'neverthrow';
import { useCurrentChainInfo } from '@recoil/settings';
import { Wallet } from 'types/wallet';
import { assertIsDeliverTxSuccess, SignatureResult, TxRaw } from '@desmoslabs/desmjs';
import { buildDesmosClient } from 'lib/TxUtils';

export default function useBroadcastTx() {
  const chainInfo = useCurrentChainInfo();

  return React.useCallback(
    async (wallet: Wallet, signatureResult: SignatureResult) => {
      const connectToClientResult = await buildDesmosClient(chainInfo!.rpcUrl, wallet.signer);

      // Connection to the chain failed, return error.
      if (connectToClientResult.isErr()) {
        return err(connectToClientResult.error);
      }

      const client = connectToClientResult.value;

      // Broadcast the transaction.
      return ResultAsync.fromPromise(
        client.broadcastTx(TxRaw.encode(signatureResult.txRaw).finish()).then(response => {
          // Since we are wrapping the broadcast tx into a Result and the DeliverTxResponse
          // can also represent a failed broadcast we should assert that the response
          // is successful so that if the broadcast failed the final result
          // will be an Error with the failure message.
          assertIsDeliverTxSuccess(response);
          return response;
        }),
        (e: any) => Error(`failed to broadcast tx: ${e}`),
      );
    },
    [chainInfo],
  );
}
