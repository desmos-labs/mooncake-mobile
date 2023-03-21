import React from 'react';
import { useRemoveStoredPendingPost, useUpdateStoredPendingPost } from '@recoil/posts';
import { PostUpdate, PostUpdateType } from 'lib/PostsUtils';
import useSyncPendingTransactions from 'hooks/transactions/useSyncPendingTransactions';

/**
 * Hook that allows to delete the pending posts based on the data retrieved from the server.
 */
const useUpdatePendingPosts = () => {
  const updateStoredPendingPost = useUpdateStoredPendingPost();
  const removeStoredPendingPost = useRemoveStoredPendingPost();

  const syncPendingTransactions = useSyncPendingTransactions();

  return React.useCallback(
    (user: string, updates: PostUpdate[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case PostUpdateType.CREATE:
            // We don't care about new posts being created
            break;

          case PostUpdateType.REPLACE: {
            const { original, updated } = update;
            updateStoredPendingPost(user, original.subspaceId, original.externalId, updated);
            break;
          }

          case PostUpdateType.DELETE: {
            const { post } = update;
            removeStoredPendingPost(user, post.subspaceId, post.externalId);
            break;
          }
        }
      });

      // Update the pending transactions to remove the ones that are now on-chain or are expired
      syncPendingTransactions();
    },
    [removeStoredPendingPost, syncPendingTransactions, updateStoredPendingPost],
  );
};

export default useUpdatePendingPosts;
