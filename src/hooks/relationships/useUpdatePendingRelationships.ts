import React from 'react';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import { FollowedUser } from 'types/relationships';
import { useRemovePendingFollowedUser, useUpdatePendingFollowedUser } from '@recoil/relationships';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';

/**
 * Hook that allows to update the pending relationships based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending relationships should be updated.
 */
const useUpdatePendingRelationships = (user: string) => {
  const updateStoredPendingFollowedUser = useUpdatePendingFollowedUser(user);
  const removeStoredPendingFollowedUser = useRemovePendingFollowedUser(user);

  const syncPendingTransactions = useSyncPendingTransactions();

  return React.useCallback(
    (updates: CachedDataUpdate<FollowedUser>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new followed users
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingFollowedUser(original.user.address, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingFollowedUser(data.user.address);
            break;
          }
        }
      });

      // Update the pending transactions to remove the ones that are now on-chain or are expired
      syncPendingTransactions();
    },
    [removeStoredPendingFollowedUser, syncPendingTransactions, updateStoredPendingFollowedUser],
  );
};

export default useUpdatePendingRelationships;
