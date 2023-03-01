import React from 'react';
import { PastTransactionMessage } from 'types/transactions';
import { useDeletePendingTransactions } from '@recoil/transactions';

/**
 * Hook that returns a function allowing to update the pending transactions for the given user based
 * on the past transactions downloaded for the server.
 */
const useUpdatePendingTransactions = () => {
  const deletePendingTransactions = useDeletePendingTransactions();
  return React.useCallback(
    (remoteMessages: PastTransactionMessage[]) => {
      const hashes = remoteMessages.map(message => message.hash);
      deletePendingTransactions(hashes);
    },
    [deletePendingTransactions],
  );
};

export default useUpdatePendingTransactions;
