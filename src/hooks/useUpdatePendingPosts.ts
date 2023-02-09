import React from 'react';
import { Post, PostStatus } from 'types/posts';
import { useGetPostToSync, useRemoveStoredPendingPost, useUpdatePostStatus } from '@recoil/posts';
import { findSamePost } from 'lib/PostsUtils';

/**
 * Hook that allows to delete the pending posts based on the data retrieved from the server.
 * @param user {string} - Address of the user for which the pending posts should be deleted.
 *
 * TODO: See how to simplify this logic
 * We should look at the logic within this method, and see if it can be merged with the one
 * present inside the {@link mergePosts} logic as well.
 */
const useUpdatePendingPosts = (user: string) => {
  const getPostToSync = useGetPostToSync(user);
  const removeStoredPendingPost = useRemoveStoredPendingPost(user);
  const updatePostStatus = useUpdatePostStatus(user);

  return React.useCallback(
    (pendingPosts: Post[], onChainPosts: Post[]) => {
      onChainPosts.forEach(post => {
        const postToSync = getPostToSync(post.subspaceId, post.externalId);
        switch (postToSync?.status) {
          case undefined:
            // The post to sync is not defined, so do nothing
            break;

          case PostStatus.CREATED_LOCALLY:
            // The post was created locally, and it's now on-chain.
            // So we can just delete the local one
            removeStoredPendingPost(post.subspaceId, post.externalId);
            break;

          case PostStatus.EDITED_LOCALLY:
            // TODO: We should make sure the edits are now on-chain, then update the post status
            break;
        }
      });

      // Iterate over all the deleted pending posts and check whether they should be deleted or restored
      const pendingDeletedPosts = pendingPosts.filter(p => p.status === PostStatus.DELETED_LOCALLY);
      pendingDeletedPosts.forEach(post => {
        const onChainPostIndex = findSamePost(onChainPosts, post);
        if (onChainPostIndex === -1) {
          // The post was deleted locally, and it's no longer on-chain as well.
          // We can safely remove it from the cache as well
          removeStoredPendingPost(post.subspaceId, post.externalId);
        } else {
          // The post was deleted locally, but it's on-chain. If the max offset
          // was passed, we should restore this post
          const offset = Date.now() - Date.parse(post.creationDate);
          if (offset > 30 * 1000) {
            updatePostStatus(post, PostStatus.SYNCED);
          }
        }
      });

      // TODO: Update the pending transactions by deleting the successful ones, or changing their statuses
    },
    [getPostToSync, removeStoredPendingPost, updatePostStatus],
  );
};

export default useUpdatePendingPosts;
