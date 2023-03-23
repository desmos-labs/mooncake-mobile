import React from 'react';
import { useRemovePendingPostReaction, useUpdatePendingPostReaction } from '@recoil/reactions';
import { PostReaction } from 'types/desmos';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';

/**
 * Hook that allows to update the pending reactions based on the data retrieved from the server.
 */
const useUpdatePendingReactions = () => {
  const updateStoredPendingReaction = useUpdatePendingPostReaction();
  const removeStoredPendingReaction = useRemovePendingPostReaction();

  const syncPendingTransactions = useSyncPendingTransactions();

  return React.useCallback(
    (user: string, updates: CachedDataUpdate<PostReaction>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new post reactions
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingReaction(user, original.post.subspaceId, original.post.id, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingReaction(user, data.post.subspaceId, data.post.id);
            break;
          }
        }
      });

      // Update the pending transactions to remove the ones that are now on-chain or are expired
      syncPendingTransactions();
    },
    [removeStoredPendingReaction, syncPendingTransactions, updateStoredPendingReaction],
  );
};

export default useUpdatePendingReactions;
