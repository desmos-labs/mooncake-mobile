import { useSetRecoilRecordItemWithKey } from 'lib/ReocilUitils';
import { useCallback, useMemo } from 'react';
import { atom, useRecoilValue } from 'recoil';
import { Post } from 'types/posts';

/**
 * Atom that contains the comments that are currently on chain
 */
const commentsAppState = atom<Record<number, Post[]>>({
  key: 'commentsAppState',
  default: {},
});

export const useComments = (postId: number) => {
  const comments = useRecoilValue(commentsAppState);
  return useMemo(() => {
    return comments[postId] ?? [];
  }, [comments, postId]);
};

export const useSetComments = () => {
  return useSetRecoilRecordItemWithKey(commentsAppState, []);
};

export const useDeleteComments = () => {
  const setComments = useSetComments();

  return useCallback(
    (postId: number) => {
      setComments(postId, []);
    },
    [setComments],
  );
};
