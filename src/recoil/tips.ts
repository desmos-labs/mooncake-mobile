import React from 'react';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { mmkvValueToCache } from '@recoil/utils';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { areTipsEqual, ComparableTip, Tip, TipTargetType } from 'types/tips';

const tipsState = atom<MultipleUsersCache<Tip, ComparableTip>>({
  key: 'tipsState',
  default: mmkvValueToCache(MMKVKEYS.TIPS, areTipsEqual),
  effects: [
    ({ onSet }) => {
      onSet(tips => {
        setMMKV(MMKVKEYS.TIPS, tips.serialize());
      });
    },
  ],
});

/**
 * Hook that allows to store a new user tip.
 * @param user {string} - Address of the user for which to add the tip.
 */
export const useStoreTip = (user: string) => {
  const setTips = useSetRecoilState(tipsState);
  return React.useCallback(
    (tip: Tip) => {
      setTips(tips => {
        const userTips = tips.get(user);
        const updatedTips = userTips.add(tip);
        return tips.update(user, updatedTips);
      });
    },
    [setTips, user],
  );
};

/**
 * Hook that allows to know whether a user has tipped a post.
 * @param user {string} - Address of the user for which to check the tip.
 */
export const useHasPostTip = (user: string) => {
  const tips = useRecoilValue(tipsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userTips = tips.get(user);
      return userTips
        .readAll()
        .some(
          tip =>
            tip.target.type === TipTargetType.POST &&
            tip.target.post.subspaceId === subspaceId &&
            tip.target.post.id === postId &&
            tip.status !== DataStatus.DELETED_LOCALLY,
        );
    },
    [tips, user],
  );
};

/**
 * Hook that returns all the tips created by a given user, and that need to be synced with the server.
 * @param user {string} - Address of the user for which to get the tips.
 */
export const useTipsToBeSynced = (user: string) => {
  const tips = useRecoilValue(tipsState);
  const userTips = tips.get(user);
  return userTips.readAll().filter(tip => tip.status !== DataStatus.SYNCED);
};

/**
 * Hook that returns the posts tips that are stored locally and that need to be synced with the server.
 * @param user {string} - Address of the user for which to get the tips.
 */
export const useGetPostTipsToSync = (user: string) => {
  const tips = useRecoilValue(tipsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userTips = tips.get(user);
      return userTips
        .readAll()
        .filter(
          tip =>
            tip.target.type === TipTargetType.POST &&
            tip.target.post.subspaceId === subspaceId &&
            tip.target.post.id === postId,
        );
    },
    [tips, user],
  );
};

/**
 * Hook that allows to get a number representing the current difference of the user tips.
 * The difference is computed by considering:
 * • each locally deleted tip as <code>-1</code>
 * • each locally added tip as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted tips
 * • a difference of +1 means that overall there is 1 locally created tip
 *
 * This difference can be used to show an updated tips count compared to the current values on the server.
 *
 * <b>Note</b>
 * Due to the nature of tips being non-refundable, it's very unlikely that the overall
 * difference amount will be negative.
 *
 * @param user {string} - Address of the user for which to get the difference.
 */
export const useGetPostTipsDifference = (user: string) => {
  const tips = useRecoilValue(tipsState);
  return React.useCallback(
    (subspaceId: number, postId: number) => {
      const userTips = tips.get(user);
      return userTips
        .readAll()
        .filter(
          tip =>
            tip.target.type === TipTargetType.POST &&
            tip.target.post.subspaceId === subspaceId &&
            tip.target.post.id === postId,
        )
        .map(followedUser => {
          switch (followedUser.status) {
            case DataStatus.CREATED_LOCALLY:
              return 1;
            case DataStatus.DELETED_LOCALLY:
              return -1;
            default:
              return 0;
          }
        })
        .reduce((sum: number, value: number) => sum + value, 0);
    },
    [tips, user],
  );
};

/**
 * Hook that allows to update a stored pending tips for a given post.
 * @param user {string} - Address of the user for which to update the tip.
 */
export const useUpdatePendingPostTip = (user: string) => {
  const setTips = useSetRecoilState(tipsState);
  return React.useCallback(
    (original: Tip, update: Tip) => {
      setTips(tips => {
        const existingTips = tips.get(user);
        const updatedTips = existingTips
          .readAll()
          .map(t => (areTipsEqual(t, original) && t.status !== DataStatus.SYNCED ? update : t));
        return tips.update(user, existingTips.set(updatedTips));
      });
    },
    [user, setTips],
  );
};

/**
 * Hook that allows to delete a stored pending tip for a given user.
 * @param user {string} - Address of the user for which to delete the tip.
 */
export const useRemovePendingPostTip = (user: string) => {
  const setTips = useSetRecoilState(tipsState);
  return React.useCallback(
    (tip: Tip) => {
      setTips(tips => {
        const existingTips = tips.get(user);
        const updatedTips = existingTips
          .readAll()
          .filter(t => !areTipsEqual(t, tip) || t.status !== DataStatus.SYNCED);
        return tips.update(user, existingTips.set(updatedTips));
      });
    },
    [user, setTips],
  );
};

/**
 * Hook that allows to delete a tip from the stored cache.
 * @param user {string} - Address of the user for which to delete the stored tip.
 */
export const useDeleteStoredTip = (user: string) => {
  const setTips = useSetRecoilState(tipsState);
  return React.useCallback(
    (tip: Tip) => {
      setTips(tips => {
        const userTips = tips.get(user);
        const updatedTips = userTips.remove(tip);
        return tips.update(user, updatedTips);
      });
    },
    [setTips, user],
  );
};
