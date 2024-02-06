import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

const commentsCount = atom<Record<number, number>>({
  key: 'commentsCountAppState',
  default: {},
});

export const usePostCommentsCount = (postId: number) => {
  const count = useRecoilValue(commentsCount);
  return count[postId] ?? 0;
};

export const useSetPostCommentsCount = () => {
  const setCommentsCount = useSetRecoilState(commentsCount);
  return useCallback(
    (postId: number, newCount: number | ((valOrUpdater: number) => number)) => {
      setCommentsCount(currentCount => {
        if (typeof newCount === 'function') {
          return {
            ...currentCount,
            [postId]: newCount(currentCount[postId] ?? 0),
          };
        } else {
          return {
            ...currentCount,
            [postId]: newCount,
          };
        }
      });
    },
    [setCommentsCount],
  );
};

export default commentsCount;
