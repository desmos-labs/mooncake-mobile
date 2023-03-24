import React, { useState } from 'react';
import { Post } from 'types/posts';
import { useQuery } from '@apollo/client';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { getLikeReactionId } from 'types/desmos';
import { useAppStateValue } from '@recoil/appState';
import { useActiveAccountAddress } from '@recoil/accounts';
import { RegisteredReactionValueTypeUrl } from '@desmoslabs/desmjs';
import { usePostCommentsToSync } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import useUpdatePendingPosts from 'hooks/posts/useUpdatePendingPosts';

/**
 * Hook that allows to get the comments for a given post.
 * The comments retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the comments.
 * @param commentsPerPage - Number of comments to get per page.
 */
const usePostComments = (post: Pick<Post, 'subspaceId' | 'id'>, commentsPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Trying to get post comments without active user');
  }

  const subspaceParams = useAppStateValue('subspaceParams');
  const updatePendingPosts = useUpdatePendingPosts();

  const [comments, setComments] = useState<Post[]>([]);

  // Get the comments to be synced
  const commentsToSync = usePostCommentsToSync(activeAccountAddress, post.subspaceId, post.id);

  // Update the comments when the comments to sync change
  React.useEffect(() => {
    // Update the comments
    setComments(currentComments => {
      const [merged] = mergePosts(currentComments, commentsToSync);
      return merged;
    });
  }, [commentsToSync]);

  const [loading, setLoading] = useState<boolean>(true);
  const [fetchingMore, setFetchingMore] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  // Callback that is used when some data is returned by the chain
  const onCompletedCallback = React.useCallback(
    (data: any) => {
      if (!data) return;

      // Filter all the comments that were created by someone who later deleted their profile
      const filteredComments = (data.comments as any[]).filter(comment => comment.author);

      // Convert the comments to the in-app format
      const onChainComments = filteredComments.map(convertGraphQLPost);

      // Update the comments
      setComments(currentComments => {
        const [merged, updates] = mergePosts(currentComments, onChainComments);

        // Update the pending comments by deleting the ones that are now on-chain or are expired
        // This is done because comments are not cached inside the local storage of the device, and
        // they are not handled by the optimistic APIs
        updatePendingPosts(activeAccountAddress, updates);
        return merged;
      });
      setFetchingMore(false);
      setRefreshing(false);
      setLoading(false);
    },
    [activeAccountAddress, updatePendingPosts],
  );

  // Query used to get the comments
  const { refetch, fetchMore } = useQuery(GetPostComments, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
      user: activeAccountAddress,
      reaction: {
        '@type': RegisteredReactionValueTypeUrl,
        registered_reaction_id: getLikeReactionId(subspaceParams),
      },
      offset: 0,
      limit: commentsPerPage,
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
          comments: fetchMoreResult ? [...prev.comments, ...fetchMoreResult.comments] : prev,
        }),
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
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
      setRefreshing(false);
      setError(e.toString());
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

export default usePostComments;
