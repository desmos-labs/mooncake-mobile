import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { latestPostsByUserState } from '@recoil/latestPostsByUser';
import { POST_TYPE, usePostsFamily } from '@recoil/posts';
import React, { useCallback, useMemo } from 'react';
import { allPendingPostsState, pendingPostsState } from '@recoil/pendingTx/pendingPosts';

/**
 * Check if an array of PostItems contains a given txHash
 * @param {string} txHash - The txHash to search for.
 * @param {PostItem[]} posts - An array of posts to search for the txHash in.
 * @returns {PostItem|undefined} - The matching post data or undefined if no match.
 */
export const isTxHashInLatestPost = (txHash: string, posts: PostItem[]): PostItem | undefined =>
  posts.find(x => {
    const txHashes = x.transactions.map(y => y.hash);
    return txHashes.includes(txHash);
  });

export const isExternalIdInLatestPosts = (externalId: string, posts: PostItem[]) =>
  posts.find(y => y.external_id === externalId);

export const useSyncPendingPosts = () => {
  const [pendingPosts, setPendingPosts] = useRecoilState(allPendingPostsState);
  const latestPostsByUser = useRecoilValue(latestPostsByUserState);

  const { setPosts } = usePostsFamily(POST_TYPE.DISCOVER);

  /**
   * An effect that runs whenever the user's latest posts have changed.
   * See usePollLatestPostsByUser hook for the implementation.
   */
  React.useEffect(() => {
    if (latestPostsByUser && latestPostsByUser.length > 0) {
      syncPendingPosts(latestPostsByUser, pendingPosts);
    }
  }, [latestPostsByUser]);

  /**
   * A React callback that checks if a pending post has made it onto the chain, and
   * batches post data to be "transferred" from pending to broadcasted.
   */
  const syncPendingPosts = React.useCallback(
    (newPosts: PostItem[], _pendingPosts: PendingPost[]) => {
      const postsToTransfer: PostItem[] = [];
      const externalIdsToRemove: string[] = [];

      _pendingPosts.forEach(x => {
        const post = isExternalIdInLatestPosts(x.msg.value.externalId, newPosts);
        if (post) {
          postsToTransfer.push(post);
          externalIdsToRemove.push(x.msg.value.externalId);
        }
      });

      setPendingPosts(prev =>
        prev.filter(x => !externalIdsToRemove.includes(x.msg.value.externalId)),
      );
      setPosts(prev => [...postsToTransfer, ...prev]);
    },
    [],
  );
};

/**
 * A hook that wraps all logic involving pending posts.
 * Posts on Butter can be pending or non-pending. Pending posts are temporary, local data structures that contain
 * just enough data to render a placeholder PostCard on the Home page to indicate that the post is being broadcast
 * onto the chain.
 */
const usePendingPosts = () => {
  const setAllPendingPosts = useSetRecoilState(allPendingPostsState);
  const pendingPosts = useRecoilValue(pendingPostsState);

  /**
   * Add a new pending relationship to recoil state.
   * @param {PendingPost} newPost - The new relationship to be added.
   */
  const addNewPendingPost = React.useCallback((newPost: PendingPost) => {
    setAllPendingPosts(prev => [...prev, newPost]);
  }, []);

  const resolveByExternalId = useCallback((externalId: string) => {
    setAllPendingPosts(prev => prev.filter(x => x.msg.value.externalId !== externalId));
  }, []);

  /**
   * Format pending post data into a format that is easier for render code to use
   */
  const parsedPendingPosts = useMemo(() => {
    return pendingPosts.sort((a, b) => a.timestamp - b.timestamp).map(x => x.postData);
  }, [pendingPosts]);

  return {
    resolveByExternalId,
    addNewPendingPost,
    pendingPosts, // reexport pendingPosts for convenience
    parsedPendingPosts,
  };
};

export default usePendingPosts;
