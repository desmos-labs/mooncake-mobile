import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostTip } from '@recoil/tips';

/**
 * Hook that allows to know if the current application user has tipped a post or not.
 * @param post {Post} - The post for which to check whether the tip from the user exists or not.
 */
const useHasTipped = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has tipped a post, without active user');
  }

  const hasPostReaction = useHasPostTip();
  return hasPostReaction(activeAddress, post);
};

export default useHasTipped;
