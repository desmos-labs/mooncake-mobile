import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasPostTip } from '@recoil/tips';

const useHasTipped = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has reacted to a post, without active user');
  }

  const hasPostTip = useHasPostTip(activeAddress);
  return hasPostTip(post);
};

export default useHasTipped;
