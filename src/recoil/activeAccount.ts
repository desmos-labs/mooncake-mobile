import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Account } from 'types/account';
import { accountsAppState } from '@recoil/accounts';

const activeAccountAddressState = atom<string>({
  key: 'activeAccountAddress',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS) ?? '',
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newValue);
      });
    },
  ],
});

export const useSetActiveAccountAddress = () => useSetRecoilState(activeAccountAddressState);

export const useActiveAccountAddress = () => useRecoilValue(activeAccountAddressState);

const activeAccountState = selector<Account | undefined>({
  key: 'activeAccountAddress',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    const selectedAccountAddress = get(activeAccountAddressState);
    return selectedAccountAddress ? accounts[selectedAccountAddress] : undefined;
  },
});

/**
 * Hook that provide the current active account.
 */
export const useActiveAccount = () => useRecoilValue(activeAccountState);
