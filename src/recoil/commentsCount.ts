import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

/**
 * Atom used to store the number of comments for a given post.
 */
const commentsCount = atom<Record<number, number>>({
  key: 'commentsCountAppState',
  default: {},
});

/**
 * Hook that allows to get the number of comments for a given post.
 * @param postId - The ID of the post.
 */
export const usePostCommentsCount = (postId: number) => {
  const count = useRecoilValue(commentsCount);
  return count[postId] ?? 0;
};

/**
 * Hook that allows to set the number of comments for a given post.
 */
export const useSetPostCommentsCount = () => {
  const setCommentsCount = useSetRecoilState(commentsCount);
  return useCallback(
    (postId: number, valOrUpdater: number | ((currVal: number) => number)) => {
      setCommentsCount(currentCounts => {
        const currentPostCount = currentCounts[postId];
        let newCount: number;
        if (typeof valOrUpdater === 'function') {
          newCount = valOrUpdater(currentPostCount ?? 0);
        } else {
          newCount = valOrUpdater;
        }

        if (currentPostCount === newCount) {
          return currentCounts;
        } else {
          return {
            ...currentCounts,
            [postId]: newCount,
          };
        }
      });
    },
    [setCommentsCount],
  );
};
