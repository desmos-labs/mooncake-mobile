import {atom} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

const activeAddressState = atom<string>({
  key: 'activeAddress',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR) || '',
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDR, newValue);
      });
    },
  ],
});

export default activeAddressState;
