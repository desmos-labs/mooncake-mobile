import { DesmosClient } from '@desmoslabs/desmjs';
import { EncodeObject } from '@cosmjs/proto-signing';
import { getTaskContext, TaskJob } from 'lib/BackgroundTaskUtils';
import { Wallet } from 'types/wallet';

export interface SignAndBroadcastTxParams {
  /**
   * Client that will be used to broadcast the transaction.
   */
  readonly desmosClient: DesmosClient;

  /**
   * Messages to be signed and broadcasted.
   */
  readonly messages: EncodeObject[];

  /**
   * Wallet of the user that is broadcasting the transaction.
   */
  readonly signer: Wallet;

  /**
   * Optional memo that will be added to the transaction.
   */
  readonly memo?: string;
}

/**
 * Task that can be executed in the background in order to sign and broadcast a transaction.
 * @param params - Parameters required to sign and broadcast the transaction.
 * @constructor
 */
const SignAndBroadcastTxTask: TaskJob<SignAndBroadcastTxParams, string> = async (
  params: SignAndBroadcastTxParams,
) => {
  const { desmosClient, messages, signer, memo } = params;
  const { broadcastTx } = getTaskContext();

  // Sign and broadcast the transaction
  const broadcastTxResult = await broadcastTx(desmosClient, signer, messages, memo);
  return broadcastTxResult.transactionHash;
};

export default SignAndBroadcastTxTask;
