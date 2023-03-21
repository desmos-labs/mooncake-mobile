import React, { useState } from 'react';
import { areReactionsEqual, PostReaction } from 'types/desmos';
import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useQuery } from '@apollo/client';
import GetPostReactions from 'services/graphql/queries/GetPostReactions';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import { useGetPostReactionsToSync } from '@recoil/reactions';
import { mergeCacheableData } from 'lib/CacheUtils';
import useUpdatePendingReactions from 'hooks/reactions/useUpdatePendingReactions';

/**
 * Hook that allows to get the reactions for the given post.
 * The reactions retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the reactions.
 * @param reactionsPerPage {number} - Number of reactions to be fetched per page
 */
const usePostReactions = (post: Pick<Post, 'subspaceId' | 'id'>, reactionsPerPage = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Trying to get post reactions without active user');
  }

  // Get the reactions to be synced
  const getPostReactionsToSync = useGetPostReactionsToSync(activeAccountAddress);
  const postReactionsToSync = getPostReactionsToSync(post.subspaceId, post.id);
  const updatePendingReactions = useUpdatePendingReactions(activeAccountAddress);

  // Set the initial reactions state to be the reactions to sync.
  // This will later be merged with reactions from the chain at the first fetch.
  const [reactions, setReactions] = useState<PostReaction[]>(postReactionsToSync);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;
      const onChainReactions = data.reactions.map(convertGraphQLReaction);

      // Update the reactions
      setReactions(currentReactions => {
        // Merge the existing reactions with the new one
        const [merged, updates] = mergeCacheableData(
          currentReactions,
          onChainReactions,
          areReactionsEqual,
        );

        // Update the pending reactions (delete the ones that have been sent or are expired)
        updatePendingReactions(updates);
        return merged;
      });
      setLoading(false);
      setRefreshing(false);
      setFetchingMore(false);
    },
    [updatePendingReactions],
  );

  // Query used to get the comments
  const { refetch, fetchMore } = useQuery(GetPostReactions, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
      offset: 0,
      limit: reactionsPerPage,
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to refetch the next page of reactions
  const fetchMoreReactions = React.useCallback(async () => {
    try {
      if (loading) {
        return;
      }
      setError(undefined);
      setFetchingMore(true);

      await fetchMore({
        variables: { offset: reactions.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          reactions: fetchMoreResult ? [...prev.reactions, ...fetchMoreResult.reactions] : prev,
        }),
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
    }
  }, [loading, fetchMore, reactions.length]);

  // Callback that is used in order to re-fetch the entire list of reactions
  const refreshReactions = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // We are refetching the whole list of reactions, so we need to clear the cache.
      setReactions([]);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
    }
  }, [onCompletedCallback, refetch]);

  return {
    loading,
    reactions,
    refetch: refreshReactions,
    refreshing,
    fetchMore: fetchMoreReactions,
    fetchingMore,
    error,
  };
};

export default usePostReactions;
