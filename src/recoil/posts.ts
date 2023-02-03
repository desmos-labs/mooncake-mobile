import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { Post, PostStatus } from 'types/posts';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';

/**
 * Atom that holds all the posts that should be seen inside a user's timeline.
 * This also contains all the posts that have been created by the user but are
 * still waiting to be broadcast on-chain.
 * It's cached using MMKV so that the user can see the last post before they went offline.
 * We use a Record<String, Post[]> in order to be able to save multiple user's timeline if
 * the application user has multiple profiles.
 */
const timelineState = atom<Record<string, Post[]>>({
  key: 'timelineState',
  default: getMMKV(MMKVKEYS.TIMELINE) ?? {},
  effects: [
    ({ onSet }) => {
      onSet(timeline => {
        setMMKV(MMKVKEYS.TIMELINE, timeline);
      });
    },
  ],
});

/**
 * Hook that allows to get all the posts that are yet to-be-synced for a given user.
 */
export const useGetPostsToSync = () => {
  const timeline = useRecoilValue(timelineState);
  return React.useCallback(
    (user: string) => {
      const userTimeline = timeline[user] ?? [];
      return userTimeline.filter(post => post.status !== PostStatus.SYNCED);
    },
    [timeline],
  );
};

/**
 * Hook that allows to set the timeline of the given user to the provided value.
 *
 * <b>Note</b>
 * It should be responsibility of the caller of this hook to properly merge all the
 * synced and not-synced posts appropriately. By calling this method, the current timeline
 * will be entirely replaced with the given value.
 */
export const useStoreTimeline = () => {
  const setTimeline = useSetRecoilState(timelineState);
  return React.useCallback(
    (user: string, timeline: Post[]) => {
      setTimeline(currentTimeline => {
        const updatedTimeline: Record<string, Post[]> = {
          ...currentTimeline,
        };
        updatedTimeline[user] = timeline;
        return updatedTimeline;
      });
    },
    [setTimeline],
  );
};

/**
 * Hook that allows to get the stored timeline for the user having the given address.
 * If no timeline is stored, an empty list will be returned instead.
 */
export const useStoredTimeline = () => {
  const timeline = useRecoilValue(timelineState);
  return React.useCallback(
    (user: string) => {
      return timeline[user] ?? [];
    },
    [timeline],
  );
};
