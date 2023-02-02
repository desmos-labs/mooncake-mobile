import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

/**
 * Atom that holds the address of the currently active wallet.
 * This should be used as the unique reference across the entire application to determine
 * whether the user is logged in or not.
 */
export const activeAccountAddressState = atom<string | undefined>({
  key: 'activeAccountAddressState',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS),
  effects: [
    ({onSet}) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newValue);
      });
    },
  ],
});

export const useActiveAccountAddress = () =>
  useRecoilValue(activeAccountAddressState);

export const useSetActiveAccountAddress = () =>
  useSetRecoilState(activeAccountAddressState);
