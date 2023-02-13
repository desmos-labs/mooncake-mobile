import React from 'react';
import {
  useRemoveStoredPendingPostReaction,
  useUpdateStoredPendingPostReaction,
} from '@recoil/reactions';
import { PostReaction } from 'types/desmos';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';

/**
 * Hook that allows to update the pending reactions based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending posts should be deleted.
 */
const useUpdatePendingReactions = (user: string) => {
  const updateStoredPendingReaction = useUpdateStoredPendingPostReaction(user);
  const removeStoredPendingReaction = useRemoveStoredPendingPostReaction(user);

  return React.useCallback(
    (updates: CachedDataUpdate<PostReaction>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new post reactions
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingReaction(original.subspaceId, original.postId, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingReaction(data.subspaceId, data.postId);
            break;
          }
        }

        // TODO: Update the pending transactions by deleting the successful ones, or changing their statuses
      });
    },
    [removeStoredPendingReaction, updateStoredPendingReaction],
  );
};

export default useUpdatePendingReactions;
