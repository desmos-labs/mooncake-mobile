import React, { useCallback, useMemo, useState } from 'react';
import { QueryOptions, useQuery } from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import { useStoredFollowingPosts, useStoredRootPosts, useStorePosts } from '@recoil/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import useUpdatePostReactionCache from 'hooks/reactions/useUpdatePostReactionsCache';
import sleep from 'lib/sleep';

export enum PostsQueryType {
  TIMELINE,
  DISCOVERY,
}

interface DiscoveryQueryParam {
  readonly type: PostsQueryType.DISCOVERY;
}

interface TimelineQueryParams {
  readonly type: PostsQueryType.TIMELINE;
  readonly followedUsers: string[];
}

type PostsQueryParams = TimelineQueryParams | DiscoveryQueryParam;

/**
 * Returns the query params based on the given query type.
 */
const useQueryParams = (type: PostsQueryType, followingAddresses: string[]): PostsQueryParams => {
  return React.useMemo(() => {
    switch (type) {
      case PostsQueryType.TIMELINE:
        return {
          type: PostsQueryType.TIMELINE,
          followedUsers: followingAddresses,
        } as TimelineQueryParams;
      case PostsQueryType.DISCOVERY:
        return {
          type: PostsQueryType.DISCOVERY,
        } as DiscoveryQueryParam;
    }
  }, [type, followingAddresses]);
};

/**
 * Gets the query that should be used in order to get the posts from the server.
 * @param params {PostsQueryParams} - Parameters to be used for the posts query.
 * @param postsPerPage {number} - Number of posts that should be fetched per each page.
 */
const useQueryData = (params: PostsQueryParams, postsPerPage: number = 10): QueryOptions<any> => {
  return React.useMemo(() => {
    switch (params.type) {
      case PostsQueryType.DISCOVERY:
        return {
          query: GetPosts,
          variables: {
            offset: 0,
            limit: postsPerPage,
          },
        };

      default:
        return {
          query: GetPostsFromFollowing,
          variables: {
            following: Array.from(params.followedUsers),
            offset: 0,
            limit: postsPerPage,
          },
        };
    }
  }, [params, postsPerPage]);
};

/**
 * Hook that allows to get the posts of the given type, for the currently active user.
 * @param queryType {PostsQueryType} - Type of posts query that should be performed.
 */
const usePosts = (queryType: PostsQueryType) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the posts, without active user');
  }

  const followingAddresses = useFollowingAddresses();

  // Cached values
  const discoveryPosts = useStoredRootPosts(activeAddress);
  const timelinePosts = useStoredFollowingPosts(activeAddress, followingAddresses);
  const storePosts = useStorePosts(activeAddress);
  const updatePostReactionCache = useUpdatePostReactionCache(activeAddress);

  // The posts we should return are defined based on the query time we have been asked
  const posts = useMemo(
    () => (queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts),
    [queryType, timelinePosts, discoveryPosts],
  );

  // Local state, used as returned values
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Callback used when the query for the posts has completed.
  // It takes care of merging the results with the data stored
  const onCompletedCallback = useCallback(
    async (data: any) => {
      // If there is no data, just return
      if (!data) {
        setLoading(false);
        return;
      }

      // Filter all the posts that were created by someone who later deleted their profile
      const filteredPosts = (data.posts as any[]).filter(post => post.author);

      // Convert the GraphQL data to the in-app format
      const graphQLPosts = (filteredPosts as any[]).map(convertGraphQLPost);

      // Store the posts by merging the existing ones with the ones from the server
      storePosts(cachedPosts => {
        const [merged] = mergePosts(cachedPosts, graphQLPosts);
        return merged;
      });

      // Update the cache about the reactions
      graphQLPosts.forEach(post => {
        updatePostReactionCache(post);
      });

      // This sleep is added on purpose in order to make the user wait,
      // to trigger the release of serotonin inside their brain
      // (just like slot machines)
      await sleep(500);
      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
    },
    [storePosts, updatePostReactionCache],
  );

  // Get the proper query to be executed
  const queryParams = useQueryParams(queryType, followingAddresses);
  const queryData = useQueryData(queryParams);
  const { refetch, fetchMore } = useQuery(queryData.query, {
    fetchPolicy: 'network-only',
    variables: queryData.variables,
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  // Callback that is used to refetch the next page of posts
  const fetchMorePosts = React.useCallback(async () => {
    try {
      setError(undefined);
      setFetchingMore(true);
      await fetchMore({
        variables: { offset: posts.length },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;

          // If there are no more posts, stop fetching more
          if (fetchMoreResult.posts.length === 0) {
            setFetchingMore(false);
          }

          return {
            posts: [...prev.posts, ...fetchMoreResult.posts],
          };
        },
      });
    } catch (e: any) {
      setFetchingMore(false);
      setError(e.toString());
    }
  }, [setError, setFetchingMore, fetchMore, posts]);

  // Callback that is used in order to re-fetch the entire list of posts
  const refreshPosts = React.useCallback(async () => {
    try {
      setError(undefined);
      setRefreshing(true);

      // Get the new data by resetting the fetch offset to restart post fetching
      const { data } = await refetch({ ...queryData.variables, offset: 0 });
      await onCompletedCallback(data);
    } catch (e: any) {
      setRefreshing(false);
      setError(e.toString());
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

export default usePosts;
