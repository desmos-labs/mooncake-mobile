import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostReaction } from '@recoil/reactions';
import { Post } from 'types/posts';

/**
 * Hook that allows to know if the current user has reacted to a given post or not.
 * @param post {Post} - Post for which to check if a user's reaction exists or not.
 */
const useHasReacted = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has reacted to a post, without active user');
  }

  const hasPostReaction = useHasPostReaction();
  return hasPostReaction(activeAddress, post);
};

export default useHasReacted;
