import { EncodeObject } from '@cosmjs/proto-signing';
import { Coin } from '@cosmjs/stargate';
import { DeliverTxResponse } from '@desmoslabs/desmjs';

/**
 * Contains the data of a transaction that has been sent to the APIs to be broadcast,
 * but which state still needs to be confirmed.
 */
export interface PendingTransaction {
  /**
   * Hash of the transaction that has been returned from the APIs and must be used to uniquely identify this transaction.
   */
  readonly hash: string;

  /**
   * List of messages included inside this transaction.
   * These can be used to later re-build the transaction in order to retry the sending.
   */
  readonly messages: EncodeObject[];

  /**
   * Fees that have been paid for this transaction.
   */
  readonly fees: readonly Coin[];

  /**
   * Timestamp of the moment in which the transaction has been sent to the APIs.
   */
  readonly timestamp: string;

  /**
   * User that has created the transaction.
   */
  readonly user: string;
}

/**
 * Contains the data of a message that is present on the chain.
 */
export interface PastTransactionMessage {
  /**
   * Hash of the transaction that contains this message.
   */
  readonly hash: string;

  /**
   * Type of the message.
   */
  readonly type: string;

  /**
   * Index of the message inside the transaction that contains it.
   */
  readonly index: number;

  /**
   * Fees that have been paid for the transaction that contains this message.
   */
  readonly fees: Coin[];

  /**
   * Timestamp of the block inside which the transaction that contains this message has been included.
   */
  readonly timestamp: string;
}

/**
 * Contains the data of the successful result of a transaction broadcast.
 */
export interface BroadcastTxResult {
  readonly pendingTransaction: PendingTransaction;
}

/**
 * Contains the data of the successful result of a transaction broadcast using the centralized APIs.
 */
export interface BroadcastTxWithApiResult extends BroadcastTxResult {}

/**
 * Contains the data of the successful result of a transaction broadcast directly on chain.
 */
export interface BroadcastTxOnChainResult extends BroadcastTxResult {
  readonly response: DeliverTxResponse;
}
