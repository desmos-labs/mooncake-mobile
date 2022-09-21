import {atom} from 'recoil';
import {ResultTransaction} from 'types/transaction';

/**
 * Recoil atom for the user's chain links
 */
const resultTransactions = atom<ResultTransaction[]>({
  key: 'resultTransactions',
  default: [],
  effects: [
    ({onSet}) => {
      onSet((newValue, oldValue) => {
        newValue.forEach(value => {
          console.log(value);
        });
        console.log(oldValue);
      });
    },
  ],
});

export default resultTransactions;
