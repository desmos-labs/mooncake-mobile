import {atom, useRecoilState} from 'recoil';
import React from 'react';

export const pendingPostsState = atom<PendingPost[]>({
  key: 'pendingPosts',
  default: [],
});

const usePendingPosts = () => {
  const [pendingPosts, setPendingPosts] = useRecoilState(pendingPostsState);

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingPost} newPost - The new relationship to be added.
   */
  const addNewPendingPost = React.useCallback(
    (newPost: PendingPost) => {
      console.log(JSON.stringify(newPost));

      setPendingPosts(prev => [...prev, newPost]);
    },
    [pendingPosts],
  );

  /**
   * Remove a pending relationship by its txHash.
   * @param {string} txHash - The txHash to remove.
   */
  const resolveByTxHash = React.useCallback(
    (txHash: string) => {
      setPendingPosts(prev => prev.filter(x => x.txHash !== txHash));
    },
    [pendingPosts],
  );

  return {
    resolveByTxHash,
    addNewPendingPost,
  };
};

export default usePendingPosts;
