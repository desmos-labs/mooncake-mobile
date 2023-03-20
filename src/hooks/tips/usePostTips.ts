import React, { useState } from 'react';
import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { mergeCacheableData } from 'lib/CacheUtils';
import { useQuery } from '@apollo/client';
import { areTipsEqual, Tip } from 'types/tips';
import GetPostTips from 'services/graphql/queries/GetPostTips';
import { convertGraphQLPostTip } from 'lib/GraphQLUtils/tips';
import { useGetPostTipsToSync } from '@recoil/tips';
import useUpdatePendingTips from 'hooks/tips/useUpdatePendingTips';

/**
 * Hook that allows to get the tips for the given post.
 * The tips retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the tips.
 * @param tipsPerPage - Number of tips to get per each request
 */
const usePostTips = (post: Pick<Post, 'subspaceId' | 'id'>, tipsPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Trying to get post tips without active user');
  }

  // Get the tips to be synced
  const getPostTipsToSync = useGetPostTipsToSync(activeAccountAddress);
  const postTipsToSync = getPostTipsToSync(post.subspaceId, post.id);
  const updatePendingTips = useUpdatePendingTips(activeAccountAddress);

  // Set the initial tips state to be the tips to sync.
  // This will later be merged with tips from the chain at the first fetch.
  const [tips, setTips] = useState<Tip[]>(postTipsToSync);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;
      const onChainTips = data.tips.map(convertGraphQLPostTip);

      // Update the tips
      setTips(currentTips => {
        // Merge the existing tips with the new one
        const [merged, updates] = mergeCacheableData(currentTips, onChainTips, areTipsEqual);

        // Update the pending tips (delete the ones that have been sent or are expired)
        updatePendingTips(updates);

        return merged;
      });
      setLoading(false);
      setFetchingMore(false);
      setFetchingMore(false);
    },
    [updatePendingTips],
  );

  // Query used to get the comments
  const { refetch, fetchMore } = useQuery(GetPostTips, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
      offset: 0,
      limit: tipsPerPage,
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to refetch the next page of tips
  const fetchMoreTips = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      await fetchMore({
        variables: { offset: tips.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          tips: fetchMoreResult ? [...prev.tips, ...fetchMoreResult.tips] : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString());
    }
  }, [fetchMore, tips.length]);

  // Callback that is used in order to re-fetch the entire list of tips
  const refreshTips = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    }
  }, [onCompletedCallback, refetch]);

  return {
    loading,
    tips,
    refetch: refreshTips,
    refreshing,
    fetchMore: fetchMoreTips,
    fetchingMore,
    error,
  };
};

export default usePostTips;
