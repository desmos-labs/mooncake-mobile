import { findSamePost, sortPostsByCreationDate } from 'lib/PostsUtils';
import React, { useCallback, useMemo } from 'react';
import { atom, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { isCommentTo, isRootPost, Post, PostStatus } from 'types/posts';

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
  return useMemo(
    () => (userAddress ? posts[userAddress] ?? [] : []).filter(p => isRootPost(p)),
    [posts, userAddress],
  );
};

/**
 * Hook that provides the user's comments that are currently
 * being broadcast on-chain.
 */
export const useUserLocalComments = (userAddress: string | undefined, parentId: number) => {
  const posts = useRecoilValue(localPosts);
  return useMemo(
    () =>
      (userAddress ? posts[userAddress] ?? [] : []).filter(p => {
        const isComment = isCommentTo(p, parentId);
        return isComment;
      }),
    [posts, userAddress, parentId],
  );
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

/**
 * Hook that allows to get a number representing the current difference of the comments for the specified post.
 * The difference is computed by considering:
 * • each locally deleted comment as <code>-1</code>
 * • each locally added comment as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted comments
 * • a difference of +1 means that overall there is 1 locally deleted comment
 *
 * This difference can be used to show an updated comments count compared to the current values on the server.
 */
export const useGetPostCommentsDifference = () => {
  const posts = useRecoilValue(localPosts);
  return React.useCallback(
    (user: string, subspaceId: number, postId: number) => {
      const userPosts = posts[user] ?? [];
      return userPosts
        .filter(p => p.subspaceId === subspaceId && isCommentTo(p, postId))
        .map(p => {
          switch (p.status) {
            case PostStatus.CREATED_LOCALLY:
            case PostStatus.EDITED_LOCALLY:
              return 1;
            case PostStatus.DELETED_LOCALLY:
              return -1;
            default:
              return 0;
          }
        })
        .reduce((sum: number, value: number) => sum + value, 0);
    },
    [posts],
  );
};

export const useGetAllUnsyncedPosts = (activeAddress: string | undefined) => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const allPosts = await snapshot.getPromise(localPosts);
    if (!activeAddress) {
      return [];
    }
    return allPosts[activeAddress] ?? [];
  });
};
