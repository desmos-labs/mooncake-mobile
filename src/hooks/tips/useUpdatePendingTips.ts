import React from 'react';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import { useRemovePendingPostTip, useUpdatePendingPostTip } from '@recoil/tips';
import { Tip } from 'types/tips';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';

/**
 * Hook that allows to update the pending post tips based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending tips should be deleted.
 */
const useUpdatePendingTips = (user: string) => {
  const updateStoredPendingTip = useUpdatePendingPostTip(user);
  const removeStoredPendingTip = useRemovePendingPostTip(user);

  const syncPendingTransactions = useSyncPendingTransactions();

  return React.useCallback(
    (updates: CachedDataUpdate<Tip>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new post tips
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingTip(original, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingTip(data);
            break;
          }
        }
      });

      // Update the pending transactions to remove the ones that are now on-chain or are expired
      syncPendingTransactions();
    },
    [removeStoredPendingTip, syncPendingTransactions, updateStoredPendingTip],
  );
};

export default useUpdatePendingTips;
