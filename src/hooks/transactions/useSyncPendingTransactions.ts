import React from 'react';
import { useDeletePendingTransactions, usePendingTransactions } from '@recoil/transactions';
import { useLazyQuery } from '@apollo/client';
import GetTransactionsByHashes from 'services/graphql/queries/GetTransactionsByHashes';

/**
 * Hook that returns the hashes of the transactions that are on-chain.
 */
const useGetOnChainTransactionsByHashes = () => {
  const [getTransactionsByHashes] = useLazyQuery(GetTransactionsByHashes);

  return React.useCallback(
    async (hashes: string[]) => {
      const { data } = await getTransactionsByHashes({
        variables: { hashes },
      });
      return data.message.map((tx: any) => tx.transaction_hash);
    },
    [getTransactionsByHashes],
  );
};

/**
 * Hook that, for each pending transaction, checks if it has been included in a block.
 * If the transaction was broadcast correctly, of if enough time has passed to consider it failed,
 * it removes it from the local storage.
 */
const useSyncPendingTransactions = () => {
  const pendingTransactions = usePendingTransactions();

  // Create a reference to the pending transactions so that we can access them inside the callback
  // without triggering a re-render
  const transactionsRef = React.useRef(pendingTransactions);

  // Update the reference when the pending transactions change
  React.useEffect(() => {
    transactionsRef.current = pendingTransactions;
  }, [pendingTransactions]);

  const getOnChainTransactionsByHashes = useGetOnChainTransactionsByHashes();
  const deletePendingTransactions = useDeletePendingTransactions();

  return React.useCallback(async () => {
    // Get the hashes of the transactions that are on-chain
    const pendingTransactionHashes = transactionsRef.current.map(tx => tx.hash);
    const onChainTransactions = await getOnChainTransactionsByHashes(pendingTransactionHashes);

    // Get the hashes of the transactions that are pending and should be deleted
    const transactionsToDelete = transactionsRef.current.filter(tx => {
      const isOnChain = onChainTransactions.includes(tx.hash);
      const elapsedTime = Date.now() - Date.parse(tx.timestamp);

      // If the transaction is on-chain, or it was created more than 1 minute ago, delete it
      return isOnChain || elapsedTime > 60 * 1000;
    });

    // Delete the transactions
    const hashesToDelete = transactionsToDelete.map(tx => tx.hash);
    deletePendingTransactions(hashesToDelete);
  }, [deletePendingTransactions, getOnChainTransactionsByHashes]);
};

export default useSyncPendingTransactions;
