import { useCallback, useMemo } from 'react';
import { SetterOrUpdater, atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post } from 'types/posts';

/**
 * Atom that contains the posts that are currently
 * being broadcast on-chain.
 * The posts are stored in a Record where the
 * key is the address of the user that has created the
 * post.
 */
const localPosts = atom<Record<string, Post[]>>({
  key: 'localPostsAppState',
  default: {},
});

/**
 * Hook that provides the user's posts that are currently
 * being broadcast on-chain.
 */
export const useUserLocalPosts = (userAddress?: string) => {
  const posts = useRecoilValue(localPosts);
  return useMemo(() => (userAddress ? posts[userAddress] ?? [] : []), [posts, userAddress]);
};

/**
 * Hook that provides a function to update user's posts that
 * are currently being broadcast on-chain.
 */
export const useSetUserLocalPosts = (userAddress?: string) => {
  const setPosts = useSetRecoilState(localPosts);
  return useCallback<SetterOrUpdater<Post[]>>(
    valOrUpdater => {
      if (!userAddress) {
        return;
      }

      if (typeof valOrUpdater === 'function') {
        setPosts(currentTimeline => {
          const updatedPosts: Record<string, Post[]> = {
            ...currentTimeline,
          };
          updatedPosts[userAddress] = valOrUpdater(currentTimeline[userAddress] ?? []);
          return updatedPosts;
        });
      } else {
        setPosts(currentTimeline => {
          const updatedPosts: Record<string, Post[]> = {
            ...currentTimeline,
          };
          updatedPosts[userAddress] = valOrUpdater;
          return updatedPosts;
        });
      }
    },
    [setPosts, userAddress],
  );
};
