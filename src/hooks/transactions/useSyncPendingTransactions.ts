import React from 'react';
import { useDeletePendingTransaction, useGetPendingTransactions } from '@recoil/transactions';
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
  const getPendingTransactions = useGetPendingTransactions();
  const getOnChainTransactionsByHashes = useGetOnChainTransactionsByHashes();
  const deletePendingTransaction = useDeletePendingTransaction();

  return React.useCallback(async () => {
    // Get the hashes of the transactions that are on-chain
    const pendingTransactions = getPendingTransactions();
    const pendingTransactionHashes = pendingTransactions.map(tx => tx.hash);
    const onChainTransactions = await getOnChainTransactionsByHashes(pendingTransactionHashes);

    pendingTransactions.map(async pendingTransaction => {
      const isOnChain = onChainTransactions.includes(pendingTransaction.hash);
      const elapsedTime = Date.now() - Date.parse(pendingTransaction.timestamp);

      // If the transaction is on-chain, or it was created more than 1 minute ago, delete it
      if (isOnChain || elapsedTime > 60 * 1000) {
        deletePendingTransaction(pendingTransaction.hash);
      }
    });
  }, [deletePendingTransaction, getOnChainTransactionsByHashes, getPendingTransactions]);
};

export default useSyncPendingTransactions;
