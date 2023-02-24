import React from 'react';
import { PastTransactionMessage } from 'types/transactions';
import { useDeletePendingTransaction } from '@recoil/transactions';

/**
 * Hook that returns a function allowing to update the pending transactions for the given user based
 * on the past transactions downloaded for the server.
 */
const useUpdatePendingTransactions = () => {
  const deletePendingTransaction = useDeletePendingTransaction();
  return React.useCallback(
    (remoteMessages: PastTransactionMessage[]) => {
      // For each remote message, remove the locally stored pending transaction associated with it
      remoteMessages.forEach(message => {
        deletePendingTransaction(message.hash);
      });
    },
    [deletePendingTransaction],
  );
};

export default useUpdatePendingTransactions;
