import {StdFee} from '@cosmjs/amino';
import {EncodeObject} from '@cosmjs/proto-signing';

interface AutomaticTransaction {
  type: 'automatic';
  address: string;
  messages: EncodeObject[];
  fee: StdFee;
  memo?: string;
}

interface ManualTransaction {
  type: 'manual';
  address: string;
  messages: EncodeObject[];
  fee: StdFee;
  memo?: string;
  granter?: string;
}

interface Success {
  type: 'success';
}

interface Failure {
  type: 'failure';
  error: string;
}

export interface SentTransaction {
  hash: string;
  transaction: Transaction;
}

export interface ResultTransaction {
  hash: string;
  result: Result;
}

export type Transaction = AutomaticTransaction | ManualTransaction;
export type Result = Success | Failure;
