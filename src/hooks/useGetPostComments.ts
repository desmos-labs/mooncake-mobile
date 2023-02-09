import React, { useMemo, useState } from 'react';
import { Post } from 'types/posts';
import { useQuery } from '@apollo/client';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { getLikeReactionId } from 'types/desmos';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { RegisteredReactionValueTypeUrl } from '@desmoslabs/desmjs';
import { usePostsToSync } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import useUpdatePendingPosts from 'hooks/useUpdatePendingPosts';

/**
 * Hook that allows to get the comments for a given post.
 * The comments retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the comments.
 * @param commentsPerPage - Number of comments to get per page.
 */
const useGetPostComments = (post: Post, commentsPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Trying to get post comments without active user');
  }

  const subspaceId = useAppStateValue('subspaceId');
  const subspaceParams = useAppStateValue('subspaceParams');
  const updatePendingPosts = useUpdatePendingPosts(activeAccountAddress);

  // Get the comments to be synced
  const postsToSync = usePostsToSync(activeAccountAddress);
  const commentsToSync = useMemo(
    () => postsToSync.filter(p => p.conversationId === post.id),
    [post.id, postsToSync],
  );

  // Set the initial comments state to be the comments to sync.
  // This will later be merged with comments from the chain at the first fetch.
  const [comments, setComments] = useState<Post[]>(commentsToSync);

  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;
      const onChainComments = data.posts.map(convertGraphQLPost);

      // Update the comments
      setComments(currentComments => mergePosts(currentComments, onChainComments));

      // Update the pending posts
      updatePendingPosts(postsToSync, onChainComments);
    },
    [postsToSync, updatePendingPosts],
  );

  // Query used to get the comments
  const { refetch, loading, fetchMore } = useQuery(GetPostComments, {
    variables: {
      offset: 0,
      limit: commentsPerPage,
      subspaceID: subspaceId,
      user: activeAccountAddress,
      reaction: {
        '@type': RegisteredReactionValueTypeUrl,
        registered_reaction_id: getLikeReactionId(subspaceParams),
      },
    },
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to refetch the next page of comments
  const fetchMoreComments = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      await fetchMore({
        variables: { offset: comments.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          posts: fetchMoreResult ? [...prev.comments, ...fetchMoreResult.comments] : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setFetchingMore(false);
    }
  }, [fetchMore, comments.length]);

  // Callback that is used in order to re-fetch the entire list of comments
  const refreshComments = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [onCompletedCallback, refetch]);

  return {
    loading,
    comments,
    refetch: refreshComments,
    refreshing,
    fetchMore: fetchMoreComments,
    fetchingMore,
    error,
  };
};

export default useGetPostComments;
