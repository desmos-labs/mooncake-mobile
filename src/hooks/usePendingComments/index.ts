import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  pendingCommentsByPost,
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import { isTxHashInLatestPost } from 'hooks/usePendingPosts';

const usePendingComments = (postID: number, commentData: PostItem[]) => {
  const [pendingComments, setPendingComments] = useRecoilState(
    pendingPostsState(PendingPostEnum.COMMENT),
  );

  const pendingCommentsOfPost = useRecoilValue(pendingCommentsByPost(postID));

  /**
   * An effect that runs whenever the user's latest posts have changed.
   * See usePollLatestPostsByUser hook for the implementation.
   */
  React.useEffect(() => {
    syncPendingComments(commentData);
  }, [commentData]);

  /**
   * A React callback that checks if a pending post has made it onto the chain, and
   * batches post data to be "transferred" from pending to broadcasted.
   */
  const syncPendingComments = React.useCallback(
    (newComments: PostItem[]) => {
      const txHashesToRemove: string[] = [];
      pendingComments.forEach(x => {
        const post = isTxHashInLatestPost(x.txHash, newComments);
        if (post) {
          txHashesToRemove.push(x.txHash);
        }
      });
      setPendingComments(prev => prev.filter(x => !txHashesToRemove.includes(x.txHash)));
    },
    [pendingComments],
  );

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingPost} newPost - The new relationship to be added.
   */
  const addNewPendingComment = React.useCallback(
    (newPost: PendingPost) => {
      setPendingComments(prev => [...prev, newPost]);
    },
    [pendingComments],
  );

  return {
    pendingCommentsOfPost,
    addNewPendingComment,
    syncPendingComments,
  };
};

export default usePendingComments;
