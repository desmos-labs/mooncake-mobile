import {atom} from 'recoil';
import {ResultTransaction} from 'types/transaction';

/**
 * Recoil atom for the user's chain links
 */
const resultTransactions = atom<ResultTransaction[]>({
  key: 'resultTransactions',
  default: [],
});

export default resultTransactions;
