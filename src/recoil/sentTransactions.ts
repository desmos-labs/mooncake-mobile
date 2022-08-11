import {atom} from 'recoil';
import {SentTransaction} from 'types/transaction';

/**
 * Recoil atom for the user's chain links
 */
const sentTransactions = atom<SentTransaction[]>({
  key: 'sentTransactions',
  default: [],
});

export default sentTransactions;
