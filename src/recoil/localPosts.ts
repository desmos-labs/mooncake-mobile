import { findSamePost, sortPostsByCreationDate } from 'lib/PostsUtils';
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

      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        let posts: Post[];

        if (typeof valOrUpdater === 'function') {
          posts = valOrUpdater(currentTimeline[userAddress] ?? []);
        } else {
          posts = valOrUpdater;
        }

        updatedPosts[userAddress] = sortPostsByCreationDate(posts);
        return updatedPosts;
      });
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

  return useCallback(
    (user: string | undefined, post: Post) => {
      setUserPosts(user, posts => {
        const userPosts = [...posts];
        const existingPostIndex = findSamePost(userPosts, post);
        switch (existingPostIndex) {
          case -1:
            // Add the non-existing post
            userPosts.unshift(post);
            break;
          default:
            // Replace the existing post
            userPosts[existingPostIndex] = post;
            break;
        }
        return userPosts;
      });
    },
    [setUserPosts],
  );
};

/**
 * Hook that provides a function to delete a post
 * that the user is broadcasting.
 */
export const useDeleteUserLocalPost = () => {
  const setUserPosts = useSetUserLocalPosts();

  return useCallback(
    (user: string | undefined, post: Post) => {
      setUserPosts(user, current => current.filter(p => p.externalId !== post.externalId));
    },
    [setUserPosts],
  );
};
