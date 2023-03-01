import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostTip } from '@recoil/tips';
import React from 'react';

/**
 * Hook that allows to know if the current user has tipped a given post or not.
 * @param post {Post} - Post for which to check if a user's tip exists or not.
 */
const useHasTipped = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has reacted to a post, without active user');
  }

  const hasPostTip = useHasPostTip(activeAddress);
  return React.useMemo(
    () => hasPostTip(post.subspaceId, post.id),
    [hasPostTip, post.subspaceId, post.id],
  );
};

export default useHasTipped;
