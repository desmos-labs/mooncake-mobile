import React from 'react';
import { atom, useRecoilValue } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { PendingTransaction } from 'types/transactions';

/**
 * Atom that holds all the pending tx that have been sent to the APIs to be broadcast,
 * but are still waiting for confirmation.
 */
const pendingTransactionsState = atom<PendingTransaction[]>({
  key: 'pendingTransactionsState',
  default: getMMKV(MMKVKEYS.PENDING_TRANSACTIONS) ?? [],
  effects: [
    ({ onSet }) => {
      onSet(transactions => {
        setMMKV(MMKVKEYS.PENDING_TRANSACTIONS, transactions);
      });
    },
  ],
});

/**
 * Hook that allows to get all the pending tx for the user having the provided address.
 */
// It's fine to disable the eslint rule here, since this is a utility function
// eslint-disable-next-line import/prefer-default-export
export const useUserPendingTransactions = (user: string) => {
  const transactions = useRecoilValue(pendingTransactionsState);
  return React.useMemo(() => {
    return transactions.filter(tx => tx.user === user);
  }, [transactions, user]);
};
