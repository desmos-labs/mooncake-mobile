import { QueryOptions, useLazyQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useStoredFollowingPosts, useStoredRootPosts, useStorePosts } from '@recoil/posts';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import { useCallback, useMemo } from 'react';
import GetPosts from 'services/graphql/queries/GetPosts';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import { Post } from 'types/posts';
import { OperationVariables } from '@apollo/client/core';

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

interface OffsetLimitPostQueryVariables extends OperationVariables {
  readonly offset: number;
  readonly limit: number;
}

interface PostQueryVariables extends OffsetLimitPostQueryVariables {}

const useQueryParams = (type: PostsQueryType, followingAddresses: string[]) => {
  return useMemo(() => {
    if (type === PostsQueryType.TIMELINE) {
      return { type, followedUsers: followingAddresses };
    }
    return { type };
  }, [type, followingAddresses]);
};

/**
 * Hook that returns the query data for the posts query.
 * @param params Parameters that define the query type.
 */
const useQueryData = (params: PostsQueryParams): QueryOptions<PostQueryVariables> => {
  const getDiscoveryQuery = useCallback(
    () => ({
      query: GetPosts,
      variables: { offset: 0, limit: 25 },
    }),
    [],
  );

  const getTimelineQuery = useCallback(
    (followedUsers: string[]) => ({
      query: GetPostsFromFollowing,
      variables: { following: followedUsers, offset: 0, limit: 25 },
    }),
    [],
  );

  return useMemo(() => {
    if (params.type === PostsQueryType.TIMELINE) {
      const timelineParams = params as TimelineQueryParams;
      return getTimelineQuery(timelineParams.followedUsers);
    }
    return getDiscoveryQuery();
  }, [getDiscoveryQuery, getTimelineQuery, params]);
};

/**
 * Hook that returns a function that fetches posts from the server.
 * This can be used with the usePaginatedData hook.
 * @param queryData The query data for the posts query.
 */
const useFetchPosts = (queryData: QueryOptions<PostQueryVariables, any>) => {
  const [fetchServerPosts] = useLazyQuery(queryData.query);

  return useCallback<FetchDataFunction<Post>>(
    async (offset, limit) => {
      const { data, error } = await fetchServerPosts({
        fetchPolicy: 'network-only',
        variables: {
          ...queryData.variables,
          limit,
          offset,
        },
      });

      if (error) {
        throw error;
      }

      const posts = data?.posts?.map(convertGraphQLPost) ?? [];

      return {
        data: posts,
        endReached: posts.length < (queryData.variables?.limit ?? 25),
      };
    },
    [fetchServerPosts, queryData.variables],
  );
};

/**
 * Hook that returns the posts for the given query type.
 * @param queryType
 */
const usePosts = (queryType: PostsQueryType) => {
  const activeAccountAddress = useActiveAccountAddress();
  const followingAddresses = useFollowingAddresses();
  const queryParams = useQueryParams(queryType, followingAddresses);
  const queryData = useQueryData(queryParams);
  const storePosts = useStorePosts(activeAccountAddress!);
  const cachedPosts = useStoredRootPosts(activeAccountAddress!);

  const mapDataFunction = useCallback(
    (data: Post[]) => {
      const filteredPosts = data.filter((post: Post) => post.author);
      const [merged] = mergePosts(cachedPosts, filteredPosts);
      return merged;
    },
    [cachedPosts],
  );

  const { loading, refreshing, fetchMore, refresh, error } = usePaginatedData(
    useFetchPosts(queryData),
    {
      itemsPerPage: queryData.variables?.limit ?? 25,
      autoFetchFirstPage: true,
      mapData: mapDataFunction,
      onDataChanged: storePosts,
    },
  );

  const discoveryPosts = useStoredRootPosts(activeAccountAddress!);
  const timelinePosts = useStoredFollowingPosts(activeAccountAddress!, followingAddresses);

  const posts = useMemo(() => {
    return queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts;
  }, [queryType, timelinePosts, discoveryPosts]);

  return {
    posts,
    loading,
    fetchMore,
    fetchingMore: loading,
    refresh,
    refreshing,
    error,
  };
};

export default usePosts;
