import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostComment } from '@recoil/posts';

/**
 * Hook that allows to know if the current application user has commented on the provided post or not.
 * @param post {Post} - The post for which to check if the user has commented or not.
 */
const useHasCommented = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has commented to a post, without active user');
  }

  const hasPostComment = useHasPostComment();
  return hasPostComment(activeAddress, post);
};

export default useHasCommented;
