import React, { useCallback, useMemo, useState } from 'react';
import { QueryOptions, useQuery } from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import { useStoredFollowingPosts, useStoredRootPosts, useStorePosts } from '@recoil/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import useFollowingAddresses from 'hooks/useFollowingAddresses';
import { convertGraphQLPost, GraphQLPost } from 'lib/GraphQLUtils';
import { useAppStateValue } from '@recoil/appState';
import { mergePosts } from 'lib/PostsUtils';
import {
  useAddPostReaction,
  useGetPostReaction,
  useRemovePostReaction,
  useSetPostReactionStatus,
} from '@recoil/reactions';
import { CacheableObject, DataStatus } from 'types/cache';
import { getLikeReactionId } from 'types/desmos';

export enum PostsQueryType {
  TIMELINE,
  DISCOVERY,
}

interface DiscoveryQueryParam {
  readonly type: PostsQueryType.DISCOVERY;
  readonly user: string;
}

interface TimelineQueryParams {
  readonly type: PostsQueryType.TIMELINE;
  readonly user: string;
  readonly followedUsers: string[];
}

type PostsQueryParams = TimelineQueryParams | DiscoveryQueryParam;

/**
 * Returns the query params based on the given query type.
 */
const getQueryParams = (
  type: PostsQueryType,
  activeUser: string,
  followingAddresses: string[],
): PostsQueryParams => {
  switch (type) {
    case PostsQueryType.TIMELINE:
      return {
        type: PostsQueryType.TIMELINE,
        user: activeUser,
        followedUsers: followingAddresses,
      } as TimelineQueryParams;
    case PostsQueryType.DISCOVERY:
      return {
        type: PostsQueryType.DISCOVERY,
        user: activeUser,
      } as DiscoveryQueryParam;
  }
};

/**
 * Gets the query that should be used in order to get the posts from the server.
 * @param params {PostsQueryParams} - Parameters to be used for the posts query.
 * @param postsPerPage {number} - Number of posts that should be fetched per each page.
 */
const useQueryData = (params: PostsQueryParams, postsPerPage: number = 10): QueryOptions<any> => {
  const subspaceId = useAppStateValue('subspaceId');
  const subspaceParams = useAppStateValue('subspaceParams');
  switch (params.type) {
    case PostsQueryType.DISCOVERY:
      return {
        query: GetPosts,
        variables: {
          offset: 0,
          limit: postsPerPage,
          subspaceID: subspaceId,
          user: params.user,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: getLikeReactionId(subspaceParams),
          },
        },
      };

    default:
      return {
        query: GetPostsFromFollowing,
        variables: {
          offset: 0,
          limit: postsPerPage,
          subspaceID: subspaceId,
          following: Array.from(params.followedUsers),
          user: params.user,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: getLikeReactionId(subspaceParams),
          },
        },
      };
  }
};

/**
 * Allows to sleep the current execution for the provided amount of milliseconds.
 * @param ms {number} - Milliseconds for which to sleep
 */
const sleep = (ms: number) =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

/**
 * Hook that is used in order to update a generic {@link CacheableObject} related status.
 */
const useUpdateCachedData = () => {
  return useCallback(
    (
      cachedData: CacheableObject | undefined,
      isOnChain: boolean,
      onCreate: () => void,
      onUpdateStatus: (status: DataStatus) => void,
      onRemove: () => void,
    ) => {
      if (!isOnChain) {
        if (cachedData?.status === DataStatus.CREATED_LOCALLY) {
          // The data was created locally, and it's not (yet) on chain.
          // To decide whether to delete it or keep it,
          // we need to check the last update date
          const elapsedTime = Date.now() - cachedData.lastEdited.getTime();
          if (elapsedTime > 30 * 1000) {
            // The data is not on-chain after 30 seconds, so we remove it from
            // the local storage as we assume something went wrong
            onRemove();
          }
        } else if (cachedData?.status === DataStatus.DELETED_LOCALLY) {
          // The data was deleted locally, and now it's not on chain as well.
          // This means we can safely remove it from the cache
          onRemove();
        } else if (cachedData?.status === DataStatus.SYNCED) {
          // The data was in-sync with the chain, it's not been edited locally,
          // but now it's no longer on-chain. This means it was deleted from another
          // device. So we remove it from the cache as well.
          onRemove();
        }
      } else {
        if (cachedData === undefined) {
          // The data is present on-chain, but it's not present locally.
          // This means it was added from another device. So we just add it
          onCreate();
        } else if (cachedData?.status === DataStatus.CREATED_LOCALLY) {
          // The data was created locally, and now it's on-chain as well.
          // For this reason, we just update its status to be in-sync with the chain.
          onUpdateStatus(DataStatus.SYNCED);
        } else if (cachedData?.status === DataStatus.DELETED_LOCALLY) {
          // The data was deleted locally, but it's still on-chain. To decide
          // what to do, we should check the last update time
          const elapsedTime = Date.now() - cachedData.lastEdited.getTime();
          if (elapsedTime > 30 * 1000) {
            // The data is on-chain after 30 seconds of the local deletion.
            // We are going to switch back its status to SYNCED in order to
            // revert the changes, as we assume something went wrong
            onUpdateStatus(DataStatus.SYNCED);
          }
        }
      }
    },
    [],
  );
};

/**
 * Hook that allows to update the cached data about the reaction that a user has added/removed from a post.
 * @param activeAddress {string} - Address of the active account.
 */
const useUpdateUpdatePostReactionCache = (activeAddress: string) => {
  const getPostReaction = useGetPostReaction();
  const addPostReaction = useAddPostReaction();
  const setPostReactionStatus = useSetPostReactionStatus();
  const removePostReaction = useRemovePostReaction();

  const updateCachedData = useUpdateCachedData();

  return useCallback(
    (post: GraphQLPost) => {
      const cachedPostReaction = getPostReaction(activeAddress, post);
      updateCachedData(
        cachedPostReaction,
        post.hasReacted,
        () => addPostReaction(activeAddress, post),
        (status: DataStatus) => setPostReactionStatus(activeAddress, post, status),
        () => removePostReaction(activeAddress, post),
      );
    },
    [
      activeAddress,
      addPostReaction,
      getPostReaction,
      removePostReaction,
      setPostReactionStatus,
      updateCachedData,
    ],
  );
};

/**
 * Hook that allows to get the posts of the given type, for the currently active user.
 * @param queryType {PostsQueryType} - Type of posts query that should be performed.
 */
const useGetPosts = (queryType: PostsQueryType) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the posts, without active user');
  }

  const followingAddresses = useFollowingAddresses();

  // Cached values
  const discoveryPosts = useStoredRootPosts(activeAddress);
  const timelinePosts = useStoredFollowingPosts(activeAddress, followingAddresses);
  const storePosts = useStorePosts(activeAddress);
  const updatePostReactionData = useUpdateUpdatePostReactionCache(activeAddress);

  // The posts we should return are defined based on the query time we have been asked
  const posts = useMemo(
    () => (queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts),
    [queryType, timelinePosts, discoveryPosts],
  );

  // Local state, used as returned values
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Callback used when the query for the posts has completed.
  // It takes care of merging the results with the data stored
  const onCompletedCallback = useCallback(
    (data: any) => {
      // If there is no data, just return
      if (!data) return;

      // Convert the GraphQL data to the in-app format
      const graphQLPosts = (data.posts as any[]).map(convertGraphQLPost);

      // Store the posts by merging the existing ones with the ones from the server
      storePosts(cachedPosts => mergePosts(cachedPosts, graphQLPosts));

      // Update the cache about the reactions
      graphQLPosts.forEach(post => {
        updatePostReactionData(post);
      });
    },
    [storePosts, updatePostReactionData],
  );

  // Get the proper query to be executed
  const queryParams = getQueryParams(queryType, activeAddress, followingAddresses);
  const queryData = useQueryData(queryParams);
  const { refetch, loading, fetchMore } = useQuery(queryData.query, {
    variables: queryData.variables,
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to refetch the next page of posts
  const fetchMorePosts = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);

      // This sleep is added on purpose in order to make the user wait,
      // to trigger the release of serotonin inside their brain
      // (just like slot machines)
      await sleep(500);

      await fetchMore({
        variables: { offset: posts.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          posts: fetchMoreResult ? [...prev.posts, ...fetchMoreResult.posts] : prev,
        }),
      });
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setFetchingMore(false);
    }
  }, [setError, setFetchingMore, fetchMore, posts]);

  // Callback that is used in order to re-fetch the entire list of posts
  const refreshPosts = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // This sleep is added on purpose in order to make the user wait,
      // to trigger the release of serotonin inside their brain
      // (just like slot machines)
      await sleep(500);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ ...queryData.variables, offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [refetch, queryData.variables, onCompletedCallback]);

  return {
    posts,
    loading,
    fetchMore: fetchMorePosts,
    fetchingMore,
    refresh: refreshPosts,
    refreshing,
    error,
  };
};

export default useGetPosts;
