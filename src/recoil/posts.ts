import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { findSamePost } from 'lib/PostsUtils';
import React from 'react';
import { atom, RecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { DesmosProfile } from 'types/desmos';
import { isRootPost, Post } from 'types/posts';
import _ from 'lodash';

/**
 * Atom that holds all the posts that are somehow related to a user.
 * It's cached using MMKV so that the user can see the last post before they went offline.
 * We use a Record<String, Post[]> in order to be able to save multiple user's timeline if
 * the application user has multiple profiles.
 */
const postsState = atom<Record<string, Post[]>>({
  key: 'postsState',
  default: getMMKV(MMKVKEYS.POSTS) ?? {},
  effects: [
    ({ onSet }) => {
      onSet(posts => {
        setMMKV(MMKVKEYS.POSTS, posts);
      });
    },
  ],
});

/**
 * Atom that holds all the posts moda from the users that the user follows.
 * It's cached using MMKV so that the user can see the last post before they went offline.
 * We use a Record<String, Post[]> in order to be able to save multiple user's timeline if
 * the application user has multiple profiles.
 */
const followingPostsState = atom<Record<string, Post[]>>({
  key: 'followingPostsState',
  default: getMMKV(MMKVKEYS.FOLLOWING_POSTS) ?? {},
  effects: [
    ({ onSet }) => {
      onSet(posts => {
        setMMKV(MMKVKEYS.FOLLOWING_POSTS, posts);
      });
    },
  ],
});

/**
 * Hook that allows to store a given post.
 */
export const useStorePost = () => {
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (user: string, post: Post) => {
      setPosts(posts => {
        const userPosts = posts[user] ?? [];
        let newPosts = userPosts;
        const existingPostIndex = findSamePost(userPosts, post);
        switch (existingPostIndex) {
          case -1:
            // Add the non-existing post
            newPosts = [...userPosts, post];
            break;
          default:
            // Ensure that the new post is not the same as the existing one.
            if (post !== newPosts[existingPostIndex]) {
              // Replace the existing post
              newPosts = userPosts.slice();
              newPosts[existingPostIndex] = post;
            }
            break;
        }

        if (newPosts !== userPosts && userPosts.length > 0) {
          // Update the value
          const updatedPosts: Record<string, Post[]> = {
            ...posts,
            [user]: newPosts,
          };
          return updatedPosts;
        } else {
          return posts;
        }
      });
    },
    [setPosts],
  );
};

const useMakeStorePosts = (recoil: RecoilState<Record<string, Post[]>>, user: string) => {
  const setPosts = useSetRecoilState(recoil);

  return React.useCallback(
    (valOrUpdater: ((currVal: Post[]) => Post[]) | Post[]) => {
      setPosts(currentTimeline => {
        let posts: Post[];
        if (typeof valOrUpdater === 'function') {
          posts = valOrUpdater(currentTimeline[user] ?? []);
        } else {
          posts = valOrUpdater;
        }

        if (posts === currentTimeline[user]) {
          return currentTimeline;
        }

        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
          [user]: posts,
        };
        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};

/**
 * Hook that allows to set the posts related to a user.
 *
 * <b>Note</b>
 * It should be responsibility of the caller of this hook to properly merge all the
 * synced and not-synced posts appropriately. By calling this method, the current timeline
 * will be entirely replaced with the given value.
 */
export const useStorePosts = (user: string) => {
  return useMakeStorePosts(postsState, user);
};

/**
 * Hook that allows to append posts to the current user's timeline.
 */
export const useAppendPosts = (user: string) => {
  const setPosts = useStorePosts(user);
  return React.useCallback(
    (posts: Post[]) => {
      setPosts((currPosts: Post[]) => {
        return _.uniqBy([...currPosts, ...posts], 'externalId');
      });
    },
    [setPosts],
  );
};

/**
 * Hook that allows to set the posts created by the users followed by a user.
 *
 * <b>Note</b>
 * It should be responsibility of the caller of this hook to properly merge all the
 * synced and not-synced posts appropriately. By calling this method, the current timeline
 * will be entirely replaced with the given value.
 */
export const useStoreFollowingPosts = (user: string) => {
  return useMakeStorePosts(followingPostsState, user);
};

/**
 * Hook that allows to append posts to the list of posts for users that a user is following.
 */
export const useAppendFollowingPosts = (user: string) => {
  const setPosts = useStoreFollowingPosts(user);
  return React.useCallback(
    (posts: Post[]) => {
      setPosts((currPosts: Post[]) => {
        return _.uniqBy([...currPosts, ...posts], 'externalId');
      });
    },
    [setPosts],
  );
};

/**
 * Hook that allows to get the stored root posts for the user having the given address.
 * A root post is defined as a post that has <code>conversationId</code> equals to <code>0</code>.
 */
export const useStoredRootPosts = (user: string) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(() => (posts[user] ?? []).filter(isRootPost), [posts, user]);
};

/**
 * Hook that allows to get all the stored posts for the user having the given address that were
 * created by either one of the addresses provided inside the <code>users</code> array.
 */
export const useStoredFollowingPosts = (user: string, followingAddresses: string[]) => {
  const posts = useRecoilValue(followingPostsState);
  return React.useMemo(
    () => posts[user]?.filter(post => followingAddresses.includes(post.author.address)) ?? [],
    [followingAddresses, posts, user],
  );
};

/**
 * A hook that allows removal of cached timeline posts of an user via the postID.
 */
export const useRemovePostByID = () => {
  const setPosts = useSetRecoilState(postsState);

  return React.useCallback(
    (user: string, postID: number) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post with matching postID
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(post => post.id !== postID);

        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * A hook that allows removal of cached timeline posts for a given user by the author.
 */
export const useRemovePostsByAuthor = () => {
  const setPosts = useSetRecoilState(postsState);

  return React.useCallback(
    (user: string, authorToRemove: DesmosProfile) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        // Update the user posts by filtering out the post with matching author
        const userPosts = updatedPosts[user] ?? [];
        updatedPosts[user] = userPosts.filter(
          post => post.author.address !== authorToRemove.address,
        );

        return updatedPosts;
      });
    },
    [setPosts],
  );
};

/**
 * Hook that provides a cached post by its ID.
 */
export const useCachedPostById = (userAddress: string, postID: number) => {
  const posts = useRecoilValue(postsState);
  return React.useMemo(
    () => posts[userAddress]?.find(post => post.id === postID),
    [posts, userAddress, postID],
  );
};
