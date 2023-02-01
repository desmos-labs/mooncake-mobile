import React from 'react';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {PendingTransaction} from 'types/transactions';

/**
 * Atom that holds all the pending transactions that have been sent to the APIs to be broadcast,
 * but are still waiting for confirmation.
 */
const pendingTransactionsState = atom<Record<string, PendingTransaction[]>>({
  key: 'pendingTransactionsState',
  default: getMMKV(MMKVKEYS.PENDING_TRANSACTIONS) ?? {},
  effects: [
    ({onSet}) => {
      onSet(transactions => {
        setMMKV(MMKVKEYS.PENDING_TRANSACTIONS, transactions);
      });
    },
  ],
});

/**
 * Hook that allows to get all the pending transactions for the user having the provided address.
 */
export const useGetPendingTransactions = () => {
  const transactions = useRecoilValue(pendingTransactionsState);
  return React.useCallback(
    (user: string) => {
      return transactions[user];
    },
    [transactions],
  );
};

/**
 * Hook that allows to get the pending transaction having a specified hash, if it exists.
 */
export const useGetPendingTransaction = () => {
  const transactions = useRecoilValue(pendingTransactionsState);
  return React.useCallback(
    (txHash: string): PendingTransaction | undefined => {
      // Find the entry containing the transaction with the given hash
      const entry = Object.entries(transactions).find(
        ([, txs]) => txs.find(tx => tx.hash === txHash) !== undefined,
      );
      if (!entry) {
        return undefined;
      }

      // Find the pending transaction
      const [, txs] = entry;
      return txs.find(tx => tx.hash === txHash);
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
    (user: string, transaction: PendingTransaction) => {
      setTransactions(currentTransactions => {
        // Get the user transactions
        const userTransactions = currentTransactions[user] ?? [];
        const existingTransactionIndex = userTransactions.findIndex(
          t => t.hash === transaction.hash,
        );

        switch (existingTransactionIndex) {
          case -1:
            // The transaction is brand new, so just add it
            userTransactions.push(transaction);
            break;

          default:
            // The transaction exists, so replace the current one with the new one
            userTransactions[existingTransactionIndex] = transaction;
        }

        // Update the stored value
        const updatedTransactions: Record<string, PendingTransaction[]> = {
          ...currentTransactions,
        };
        updatedTransactions[user] = userTransactions;
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
        // Find the entry which transactions contain the one with the provided hash
        const entry = Object.entries(currentTransactions).find(
          ([_, transactions]) =>
            transactions.find(t => t.hash === txHash) !== undefined,
        );

        // If the entry was not found, it means the transaction was already deleted
        if (!entry) {
          return currentTransactions;
        }

        // Update the transactions list removing the one with the provided hash
        const [user, transactions] = entry;
        const filteredTransactions = transactions.filter(
          t => t.hash !== txHash,
        );

        // Update the stored value
        const updatedTransactions: Record<string, PendingTransaction[]> = {
          ...currentTransactions,
        };
        updatedTransactions[user] = filteredTransactions;
        return updatedTransactions;
      });
    },
    [setTransactions],
  );
};
