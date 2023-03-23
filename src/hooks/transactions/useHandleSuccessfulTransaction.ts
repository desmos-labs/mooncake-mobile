import React from 'react';
import { useDeletePendingTransactions, useGetPendingTransaction } from '@recoil/transactions';
import useHandlePostsMessages from 'hooks/transactions/useHandlePostsMessages';
import useHandleReactionsMessages from 'hooks/transactions/useHandleReactionsMessages';

/**
 * Hook that returns a function that allows to handle the successful broadcasting of a transaction.
 */
const useHandleSuccessfulTransaction = () => {
  const getPendingTransaction = useGetPendingTransaction();
  const deletePendingTransactions = useDeletePendingTransactions();

  const handlePostsMessages = useHandlePostsMessages();
  const handleReactionsMessages = useHandleReactionsMessages();

  return React.useCallback(
    async (txHash: string) => {
      const transaction = getPendingTransaction(txHash);
      if (!transaction) {
        // This transaction was not locally stored, so we can't do anything
        return;
      }

      // Handle the messages
      await handlePostsMessages(transaction.messages);
      await handleReactionsMessages(transaction.messages);

      // Delete the pending transaction as it was successful
      deletePendingTransactions([txHash]);
    },
    [
      deletePendingTransactions,
      getPendingTransaction,
      handlePostsMessages,
      handleReactionsMessages,
    ],
  );
};

export default useHandleSuccessfulTransaction;
