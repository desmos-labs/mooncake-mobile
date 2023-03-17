import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { PendingTransaction } from 'types/transactions';

/**
 * Atom that holds all the pending transactions that have been sent to the APIs to be broadcast,
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
 * Hook that allows to get the list of all pending transactions for all users.
 */
export const usePendingTransactions = () => useRecoilValue(pendingTransactionsState);

/**
 * Hook that allows to get all the pending transactions for the user having the provided address.
 */
export const useUserPendingTransactions = (user: string) => {
  const transactions = useRecoilValue(pendingTransactionsState);
  return React.useMemo(() => {
    return transactions.filter(tx => tx.user === user);
  }, [transactions, user]);
};

/**
 * Hook that allows to get the pending transaction having a specified hash, if it exists.
 */
export const useGetPendingTransaction = () => {
  const transactions = useRecoilValue(pendingTransactionsState);
  return React.useCallback(
    (txHash: string): PendingTransaction | undefined => {
      return transactions.find(tx => tx.hash === txHash);
    },
    [transactions],
  );
};

/**
 * Hook that allows to store a pending transaction inside the current list of pending transactions for the given user.
 */
export const useStorePendingTransaction = () => {
  const setTransactions = useSetRecoilState(pendingTransactionsState);
  return React.useCallback(
    (transaction: PendingTransaction) => {
      setTransactions(currentTransactions => {
        // Get the user transactions
        const existingTransactionIndex = currentTransactions.findIndex(
          t => t.hash === transaction.hash && t.user === transaction.user,
        );

        // Update the transaction, or insert it if not existing
        const updatedTransactions = [...currentTransactions];
        switch (existingTransactionIndex) {
          case -1:
            // The transaction is brand new, so just add it
            updatedTransactions.push(transaction);
            break;

          default:
            // The transaction exists, so replace the current one with the new one
            updatedTransactions[existingTransactionIndex] = transaction;
        }

        // Update the stored value
        return updatedTransactions;
      });
    },
    [setTransactions],
  );
};

/**
 * Hook that allows to delete a pending transaction given its hash.
 */
export const useDeletePendingTransaction = () => {
  const setTransactions = useSetRecoilState(pendingTransactionsState);
  return React.useCallback(
    (txHash: string) => {
      setTransactions(currentTransactions => {
        return currentTransactions.filter(t => t.hash !== txHash);
      });
    },
    [setTransactions],
  );
};

/**
 * Hook that allows to delete a series of pending transaction given their hash or a predicate.
 */
export const useDeletePendingTransactions = () => {
  const setTransactions = useSetRecoilState(pendingTransactionsState);
  return React.useCallback(
    (value: string[] | ((tx: PendingTransaction) => boolean)) => {
      setTransactions(currentTransactions => {
        switch (typeof value) {
          case 'function':
            return currentTransactions.filter(value);
          case 'object':
            return currentTransactions.filter(t => !value.includes(t.hash));
        }
      });
    },
    [setTransactions],
  );
};
