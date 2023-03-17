import React from 'react';
import { useDeletePendingTransactions, useGetPendingTransaction } from '@recoil/transactions';
import useHandlePostsMessages from 'hooks/transactions/useHandlePostsMessages';

/**
 * Hook that returns a function that allows to handle the successful broadcasting of a transaction.
 */
const useHandleSuccessfulTransaction = () => {
  const getPendingTransaction = useGetPendingTransaction();
  const deletePendingTransactions = useDeletePendingTransactions();

  const handlePostsMessages = useHandlePostsMessages();

  return React.useCallback(
    async (txHash: string) => {
      console.log('Handling successful transaction', txHash);

      const transaction = getPendingTransaction(txHash);
      if (!transaction) {
        console.log('Transaction not found', txHash);
        // This transaction was not locally stored, so we can't do anything
        return;
      }

      // Handle the messages
      console.log('Transaction found', txHash);
      await handlePostsMessages(transaction.messages);

      // Delete the pending transaction as it was successful
      deletePendingTransactions([txHash]);
    },
    [deletePendingTransactions, getPendingTransaction, handlePostsMessages],
  );
};

export default useHandleSuccessfulTransaction;
