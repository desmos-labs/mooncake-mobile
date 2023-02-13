import React from 'react';
import { useRemoveStoredPendingPost, useUpdateStoredPendingPost } from '@recoil/posts';
import { PostUpdate, PostUpdateType } from 'lib/PostsUtils';

/**
 * Hook that allows to delete the pending posts based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending posts should be deleted.
 */
const useUpdatePendingPosts = (user: string) => {
  const updateStoredPendingPost = useUpdateStoredPendingPost(user);
  const removeStoredPendingPost = useRemoveStoredPendingPost(user);

  return React.useCallback(
    (updates: PostUpdate[]) => {
      updates.forEach(update => {
        switch (update.type) {
          case PostUpdateType.CREATE:
            // We don't care about new posts being created
            break;

          case PostUpdateType.REPLACE: {
            const { original, updated } = update;
            updateStoredPendingPost(original.subspaceId, original.externalId, updated);
            break;
          }

          case PostUpdateType.DELETE: {
            const { post } = update;
            removeStoredPendingPost(post.subspaceId, post.externalId);
            break;
          }
        }

        // TODO: Update the pending transactions by deleting the successful ones, or changing their statuses
      });
    },
    [removeStoredPendingPost, updateStoredPendingPost],
  );
};

export default useUpdatePendingPosts;
