import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

const latestPostsState = atom<Record<string, PostItem[]>>({
  key: 'latestPostsState',
  default: {},
  effects: [
    ({ onSet }) => {
      onSet(posts => {
        setMMKV(MMKVKEYS.LATEST_POSTS, posts);
      });
    },
  ],
});

/**
 * Hook that allows to store the latest posts for the user having a given address.
 */
export const useStoreLatestPostsByUser = () => {
  const setLatestPosts = useSetRecoilState(latestPostsState);
  return React.useCallback(
    (user: string, posts: PostItem[]) => {
      setLatestPosts(currentPosts => {
        const newPosts: Record<string, PostItem[]> = {
          ...currentPosts,
        };
        newPosts[user] = posts;
        return newPosts;
      });
    },
    [setLatestPosts],
  );
};

/**
 * Hook that allows to get the latest posts for the user having the given address.
 * @param user {string} - Address of the user for which to get the latest posts.
 */
export const useStoredLatestPostsByUser = (user: string) => {
  const latestPosts = useRecoilValue(latestPostsState);
  return latestPosts[user];
};
