import React from 'react';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import { FollowedUser } from 'types/relationships';
import { useRemovePendingFollowedUser, useUpdatePendingFollowedUser } from '@recoil/relationships';

/**
 * Hook that allows to update the pending relationships based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending relationships should be updated.
 */
const useUpdatePendingRelationships = (user: string) => {
  const updateStoredPendingFollowedUser = useUpdatePendingFollowedUser(user);
  const removeStoredPendingFollowedUser = useRemovePendingFollowedUser(user);

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

        // TODO: Update the pending transactions by deleting the successful ones, or changing their statuses
      });
    },
    [removeStoredPendingFollowedUser, updateStoredPendingFollowedUser],
  );
};

export default useUpdatePendingRelationships;
