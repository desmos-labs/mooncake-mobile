import { useSetRecoilRecordItemWithKey } from 'lib/RecoilUtils';
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

/**
 * Hook that allows to get the comments for the given post.
 * @param postId - ID of the post for which to get the comments.
 */
export const useComments = (postId: number) => {
  const comments = useRecoilValue(commentsAppState);
  return useMemo(() => {
    return comments[postId] ?? [];
  }, [comments, postId]);
};

/**
 * Hook that allows to store the comments for a given post.
 */
export const useSetComments = () => {
  return useSetRecoilRecordItemWithKey(commentsAppState, []);
};

/**
 * Hook that allows to remove the comments for a given post.
 */
export const useRemoveCommentByID = () => {
  const setComments = useSetComments();
  return useCallback(
    (postId: number, commentID: number) => {
      setComments(postId, comments => {
        return comments.filter(comment => comment.id !== commentID);
      });
    },
    [setComments],
  );
};

/**
 * Hook that allows to delete the comments for a given post.
 */
export const useDeleteComments = () => {
  const setComments = useSetComments();

  return useCallback(
    (postId: number) => {
      setComments(postId, []);
    },
    [setComments],
  );
};
