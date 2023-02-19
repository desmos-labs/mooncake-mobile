import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostTip } from '@recoil/tips';

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
  return hasPostTip(post.subspaceId, post.id);
};

export default useHasTipped;
