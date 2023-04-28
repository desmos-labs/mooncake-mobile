import React from 'react';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';
import {
  useRemovePendingBlockedUser,
  useUpdatePendingBlockedUser,
} from '@recoil/blockedRelationships';
import { BlockedUser } from 'types/blockedRelationships';

/**
 * Hook that allows to update the pending relationships based on the data retrieved from the server.
 */
const useUpdatePendingBlockedRelationships = () => {
  const updateStoredPendingBlockedUser = useUpdatePendingBlockedUser();
  const removeStoredPendingBlockedUser = useRemovePendingBlockedUser();

  const syncPendingTransactions = useSyncPendingTransactions();

  return React.useCallback(
    (user: string, updates: CachedDataUpdate<BlockedUser>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new followed users
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingBlockedUser(user, original.user.address, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingBlockedUser(user, data.user.address);
            break;
          }
        }
      });

      // Update the pending transactions to remove the ones that are now on-chain or are expired
      syncPendingTransactions();
    },
    [removeStoredPendingBlockedUser, syncPendingTransactions, updateStoredPendingBlockedUser],
  );
};

export default useUpdatePendingBlockedRelationships;
