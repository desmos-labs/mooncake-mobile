import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostReaction } from '@recoil/reactions';
import { Post } from 'types/posts';
import React from 'react';

/**
 * Hook that allows to know if the current user has reacted to a given post or not.
 * @param post {Post} - Post for which to check if a user's reaction exists or not.
 */
const useHasReacted = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has reacted to a post, without active user');
  }

  const hasPostReaction = useHasPostReaction(activeAddress);
  return React.useMemo(() => {
    return hasPostReaction(post.subspaceId, post.id);
  }, [hasPostReaction, post.subspaceId, post.id]);
};

export default useHasReacted;
