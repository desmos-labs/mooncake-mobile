import {atom, useRecoilState, useRecoilValue} from 'recoil';
import React from 'react';
import {latestPostsByUserState} from '@recoil/latestPostsByUser';
import {POST_TYPE, usePostsFamily} from '@recoil/posts';

export const pendingPostsState = atom<PendingPost[]>({
  key: 'pendingPosts',
  default: [],
});

const isTxHashInLatestPost = (
  txHash: string,
  latestPosts: PostItem[],
): PostItem | undefined =>
  latestPosts.find(x => {
    const txHashes = x.transactions.map(y => y.hash);
    return txHashes.includes(txHash);
  });

const usePendingPosts = () => {
  const [pendingPosts, setPendingPosts] = useRecoilState(pendingPostsState);
  const latestPostsByUser = useRecoilValue(latestPostsByUserState);

  const {setPosts} = usePostsFamily(POST_TYPE.DISCOVER);

  const syncPendingPosts = React.useCallback(
    (newPosts: PostItem[], _pendingPosts: PendingPost[]) => {
      const postsToTransfer: PostItem[] = [];
      const txHashesToRemove: string[] = [];
      _pendingPosts.forEach(x => {
        const post = isTxHashInLatestPost(x.txHash, newPosts);
        if (post) {
          postsToTransfer.push(post);
          txHashesToRemove.push(x.txHash);
        }
      });
      setPendingPosts(prev =>
        prev.filter(x => !txHashesToRemove.includes(x.txHash)),
      );
      setPosts(prev => [...postsToTransfer, ...prev]);
    },
    [],
  );

  React.useEffect(() => {
    if (latestPostsByUser && latestPostsByUser.length > 0) {
      syncPendingPosts(latestPostsByUser, pendingPosts);
    }
  }, [latestPostsByUser]);
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
