import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, PostStatus } from 'types/posts';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Atom that holds all the posts that are somehow related to a user.
 * This also contains all the posts that have been created by the user but are
 * still waiting to be broadcast on-chain.
 * It's cached using MMKV so that the user can see the last post before they went offline.
 * We use a Record<String, Post[]> in order to be able to save multiple user's timeline if
 * the application user has multiple profiles.
 */
const postsState = atom<Record<string, Post[]>>({
  key: 'postsState',
  default: getMMKV(MMKVKEYS.POSTS) ?? {},
  effects: [
    ({ onSet }) => {
      onSet(timeline => {
        setMMKV(MMKVKEYS.POSTS, timeline);
      });
    },
  ],
});

/**
 * Hook that allows to get all the posts that are yet to-be-synced for a given user.
 */
export const useGetPostsToSync = () => {
  const posts = useRecoilValue(postsState);
  return React.useCallback(
    (user: string) => {
      const userPosts = posts[user] ?? [];
      return userPosts.filter(post => post.status !== PostStatus.SYNCED);
    },
    [posts],
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
  const setPosts = useSetRecoilState(postsState);
  return React.useCallback(
    (valOrUpdater: ((currVal: Post[]) => Post[]) | Post[]) => {
      setPosts(currentTimeline => {
        const updatedPosts: Record<string, Post[]> = {
          ...currentTimeline,
        };

        if (typeof valOrUpdater === 'function') {
          updatedPosts[user] = valOrUpdater(updatedPosts[user] ?? []);
        } else {
          updatedPosts[user] = valOrUpdater;
        }

        return updatedPosts;
      });
    },
    [setPosts, user],
  );
};

/**
 * Hook that allows to get the stored root posts for the user having the given address.
 * A root post is defined as a post that has <code>conversationId</code> equals to <code>0</code>.
 */
export const useStoredRootPosts = (user: string) => {
  const posts = useRecoilValue(postsState);
  const userPosts = posts[user] ?? [];
  return userPosts.filter(post => post.conversationId === 0);
};

/**
 * Hook that allows to get all the stored posts for the user having the given address that were
 * created by either one of the addresses provided inside the <code>users</code> array.
 */
export const useStoredFollowingPosts = (user: string, followingAddresses: string[]) => {
  const posts = useRecoilValue(postsState);
  const userPosts = posts[user] ?? [];
  return userPosts.filter(post => followingAddresses.includes(post.author.address));
};
