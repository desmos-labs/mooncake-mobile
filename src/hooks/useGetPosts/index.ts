import React, { useCallback, useMemo, useState } from 'react';
import { QueryOptions, useQuery } from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import { useStoredFollowingPosts, useStoredRootPosts } from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';
import { useActiveAccountAddress } from '@recoil/wallets';
import useFollowingAddresses from 'hooks/useFollowingAddresses';

/**
 * Increase this to get more posts per query.
 */
const POSTS_PER_FETCH = 10;

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
 * Gets the query that should be used in order to get the posts
 * based on the given {@param params}.
 */
const getQueryData = (params: PostsQueryParams): QueryOptions<any> => {
  switch (params.type) {
    case PostsQueryType.DISCOVERY:
      return {
        query: GetPosts,
        variables: {
          offset: 0,
          limit: POSTS_PER_FETCH,
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          user: params.user,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
        },
      };

    default:
      return {
        query: GetPostsFromFollowing,
        variables: {
          offset: 0,
          limit: POSTS_PER_FETCH,
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          following: Array.from(params.followedUsers),
          user: params.user,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
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

  // The posts we should return are defined based on the query time we have been asked
  const posts = useMemo(
    () => (queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts),
    [timelinePosts, discoveryPosts],
  );

  // Local state, used as returned values
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Callback used when the query for the posts has completed.
  // It takes care of merging the results with the data stored
  const onCompletedCallback = useCallback((data: any) => {
    // TODO: Convert the GraphQL data, and merge it with the cached data
    // TODO: Update the cache about the added reaction, comments and tips as well
    // const { post } = data;
    // setPosts(() => _.uniqBy([...post], 'id'));
  }, []);

  // Get the proper query to be executed
  const queryParams = getQueryParams(queryType, activeAddress, followingAddresses);
  const queryData = getQueryData(queryParams);
  const { refetch, loading, fetchMore } = useQuery(queryData.query, {
    variables: queryData.variables,
    onCompleted: onCompletedCallback,
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

      await refetch({
        ...queryData.variables,

        // Reset the fetch offset to restart post fetching
        offset: 0,
      });
    } catch (e: any) {
      setError(e.toString());
    } finally {
      // Make sure to set the fetching to false in any case
      setRefreshing(false);
    }
  }, [setError, setRefreshing, refetch, queryData]);

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
