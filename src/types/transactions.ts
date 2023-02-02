import { EncodeObject } from '@cosmjs/proto-signing';

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
}
