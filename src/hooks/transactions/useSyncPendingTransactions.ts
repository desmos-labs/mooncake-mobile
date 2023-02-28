import React from 'react';
import { useDeletePendingTransaction, usePendingTransactions } from '@recoil/transactions';
import useIsTransactionBroadcast from 'hooks/transactions/useIsTransactionBroadcast';

/**
 * Hook that, for each pending transaction, checks if it has been included in a block.
 * If the transaction was broadcast correctly, of if enough time has passed to consider it failed,
 * it removes it from the local storage.
 */
const useSyncPendingTransactions = () => {
  const pendingTransactions = usePendingTransactions();

  const isTransactionBroadcast = useIsTransactionBroadcast();
  const deletePendingTransaction = useDeletePendingTransaction();

  return React.useCallback(async () => {
    await Promise.all(
      pendingTransactions.map(async pendingTransaction => {
        const isOnChain = await isTransactionBroadcast(pendingTransaction.hash);
        const elapsedTime = Date.now() - Date.parse(pendingTransaction.timestamp);

        // If the transaction is on-chain, or it was created more than 1 minute ago, delete it
        if (isOnChain || elapsedTime > 60 * 1000) {
          deletePendingTransaction(pendingTransaction.hash);
        }
      }),
    );
  }, [deletePendingTransaction, isTransactionBroadcast, pendingTransactions]);
};

export default useSyncPendingTransactions;
