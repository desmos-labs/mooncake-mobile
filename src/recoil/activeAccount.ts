import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

const activeAccountAddressState = atom<string>({
  key: 'activeAccountAddress',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS) ?? '',
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newValue);
      });
    },
  ],
});

export const useSetActiveAccountAddress = () =>
  useSetRecoilState(activeAccountAddressState);

export const useActiveAccountAddress = () =>
  useRecoilValue(activeAccountAddressState);
