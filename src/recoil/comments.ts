import { sortPostsByCreationDate } from 'lib/PostsUtils';
import React, { useCallback, useMemo } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
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
  const setComments = useSetRecoilState(commentsAppState);
  return React.useCallback(
    (postId: number, valOrUpdater: ((currVal: Post[]) => Post[]) | Post[]) => {
      setComments(currentComments => {
        const updatedComments: Record<number, Post[]> = {
          ...currentComments,
        };

        let posts: Post[];
        if (typeof valOrUpdater === 'function') {
          posts = valOrUpdater(updatedComments[postId] ?? []);
        } else {
          posts = valOrUpdater;
        }

        updatedComments[postId] = sortPostsByCreationDate(posts);
        return updatedComments;
      });
    },
    [setComments],
  );
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
