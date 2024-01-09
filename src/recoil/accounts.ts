import React, { useCallback } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState } from 'recoil';
import { Account } from 'types/account';
import { deserializeAccounts, serializeAccounts } from 'lib/AccountUtils';
import { deleteMMKV, getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

// -------------------------------------------------------------------------------------------------------------------
// --- STORED ACCOUNTS
// -------------------------------------------------------------------------------------------------------------------

/**
 * An atom that holds all the accounts stored in the application.
 */
const accountsAppState = atom<Record<string, Account>>({
  key: 'accounts',
  default: deserializeAccounts(getMMKV(MMKVKEYS.ACCOUNTS), {}),
  effects: [
    ({ onSet }) => {
      onSet(newAccounts => {
        setMMKV(MMKVKEYS.ACCOUNTS, serializeAccounts(newAccounts));
      });
    },
  ],
});

/**
 * Hook that allows to store a new account inside the app state.
 */
export const useStoreAccount = () => {
  const setAccounts = useSetRecoilState(accountsAppState);
  return React.useCallback(
    (account: Account) => {
      setAccounts(curValue => {
        const newValue: Record<string, Account> = {
          ...curValue,
        };
        newValue[account.address] = account;
        return newValue;
      });
    },
    [setAccounts],
  );
};

/**
 * Hook that allows to get the accounts stored on the device.
 */
export const useStoredAccounts = () => useRecoilValue(accountsAppState);

/**
 * Hook that allows to easily delete every account.
 */
export const useDeleteCachedAccounts = () => {
  const setAccounts = useSetRecoilState(accountsAppState);
  const accounts = useRecoilValue(accountsAppState);
  return useCallback(() => {
    setAccounts({});
    return Object.keys(accounts);
  }, [accounts, setAccounts]);
};

// -------------------------------------------------------------------------------------------------------------------
// --- ACCOUNTS EXISTENCE CHECK
// -------------------------------------------------------------------------------------------------------------------

/**
 * Recoil select that allows to easily know if there is at least one account stored in the device or not.
 */
const hasAccountAppState = selector({
  key: 'hasAccount',
  get: ({ get }) => {
    const accounts = get(accountsAppState);
    return Object.keys(accounts).length > 0;
  },
});

/**
 * Hook that allows to easily know if there is at least one account stored inside the device or not.
 */
export const useHasAccount = () => useRecoilValue(hasAccountAppState);

// -------------------------------------------------------------------------------------------------------------------
// --- ACTIVE ACCOUNT
// -------------------------------------------------------------------------------------------------------------------

/**
 * Atom that holds the address of the currently active wallet.
 * This should be used as the unique reference across the entire application to determine
 * whether the user is logged in or not.
 */
export const activeAccountAddressState = atom<string | undefined>({
  key: 'activeAccountAddressState',
  default: getMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS),
  effects: [
    ({ onSet }) => {
      onSet(newValue => {
        if (newValue) {
          setMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS, newValue);
        } else {
          deleteMMKV(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS);
        }
      });
    },
  ],
});

export const useActiveAccountAddress = () => useRecoilValue(activeAccountAddressState);

export const useSetActiveAccountAddress = () => useSetRecoilState(activeAccountAddressState);

/**
 * Hook that allows to get the currently active account of the user.
 */
export const useActiveAccount = (): Account | undefined => {
  const activeAddress = useActiveAccountAddress();
  const accounts = useRecoilValue(accountsAppState);
  return React.useMemo(() => {
    if (!activeAddress) {
      return undefined;
    }
    return accounts[activeAddress];
  }, [activeAddress, accounts]);
};
