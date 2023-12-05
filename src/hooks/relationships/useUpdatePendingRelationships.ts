import React from 'react';
import { CachedDataUpdate, CachedDataUpdateType } from 'lib/CacheUtils';
import { FollowedUser } from 'types/relationships';
import { useRemovePendingFollowedUser, useUpdatePendingFollowedUser } from '@recoil/relationships';

/**
 * Hook that allows to update the pending relationships based on the data retrieved from the server.
 */
const useUpdatePendingRelationships = () => {
  const updateStoredPendingFollowedUser = useUpdatePendingFollowedUser();
  const removeStoredPendingFollowedUser = useRemovePendingFollowedUser();

  return React.useCallback(
    (user: string, updates: CachedDataUpdate<FollowedUser>[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case CachedDataUpdateType.CREATED:
            // We don't care about new followed users
            break;

          case CachedDataUpdateType.UPDATED: {
            const { original, updated } = update;
            updateStoredPendingFollowedUser(user, original.user.address, updated);
            break;
          }

          case CachedDataUpdateType.DELETED: {
            const { data } = update;
            removeStoredPendingFollowedUser(user, data.user.address);
            break;
          }
        }
      });
    },
    [removeStoredPendingFollowedUser, updateStoredPendingFollowedUser],
  );
};

export default useUpdatePendingRelationships;
