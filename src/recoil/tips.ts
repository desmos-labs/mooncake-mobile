import React from 'react';
import { PostTip } from 'types/desmos';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { mmkvValueToCache } from '@recoil/utils';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { Post } from 'types/posts';

type ComparableTip = Pick<PostTip, 'subspaceId' | 'postId'>;

const areTipsEqual = (first: ComparableTip, second: ComparableTip): boolean => {
  return first.subspaceId === second.subspaceId && first.postId === second.postId;
};

const tipsState = atom<MultipleUsersCache<PostTip, ComparableTip>>({
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
 * Hook that allows to know if the user has tipped a given post or not.
 * @param user {string} - Address of the user for which to check if the tips exists or not.
 */
export const useHasTippedPost = (user: string) => {
  const tips = useRecoilValue(tipsState);
  return React.useCallback(
    (post: Post) => {
      const userTips = tips.get(user);
      return userTips.has({ subspaceId: post.subspaceId, postId: post.id });
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
    (post: Post) => {
      const userTips = tips.get(user);
      return userTips
        .readAll()
        .filter(tip => tip.subspaceId === post.subspaceId && tip.postId === post.id)
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
 * Hook that allows to add a tip to a given post from a given user.
 * @param user {String} - Address of the user that is adding the tip.
 */
export const useStoreUserTip = (user: string) => {
  const setTips = useSetRecoilState(tipsState);
  return React.useCallback(
    (post: Post) => {
      setTips(currentTips => {
        const userTips = currentTips.get(user);
        const updatedTips = userTips.add({
          subspaceId: post.subspaceId,
          postId: post.id,
        } as PostTip);
        return currentTips.update(user, updatedTips);
      });
    },
    [setTips, user],
  );
};
