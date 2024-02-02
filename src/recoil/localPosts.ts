import { useCallback, useMemo } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
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
export const useSetUserLocalPosts = () => {
  const setPosts = useSetRecoilState(localPosts);
  return useCallback(
    (userAddress: string | undefined, valOrUpdater: Post[] | ((value: Post[]) => Post[])) => {
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
    [setPosts],
  );
};

/**
 * Hook that provides a function to store a post
 * that the user is broadcasting.
 */
export const useStoreUserLocalPost = () => {
  const setUserPosts = useSetUserLocalPosts();

  return useCallback((user: string | undefined, post: Post) => {
    setUserPosts(user, current => [post, ...current]);
  }, []);
};

/**
 * Hook that provides a function to delete a post
 * that the user is broadcasting.
 */
export const useDeleteUserLocalPost = () => {
  const setUserPosts = useSetUserLocalPosts();

  return useCallback((user: string | undefined, post: Post) => {
    setUserPosts(user, current => current.filter(p => p.externalId !== post.externalId));
  }, []);
};
