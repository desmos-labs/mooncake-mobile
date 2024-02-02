import { QueryOptions } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useStoredFollowingPosts, useStoredRootPosts, useStorePosts } from '@recoil/posts';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import { useCallback, useEffect, useMemo } from 'react';
import GetFollowingUsersPosts from 'services/graphql/queries/GetFollowingUsersPosts';
import GetPosts from 'services/graphql/queries/GetPosts';
import { Post } from 'types/posts';

export enum PostsQueryType {
  TIMELINE,
  DISCOVERY,
}

interface DiscoveryQueryParam {
  readonly type: PostsQueryType.DISCOVERY;
}

interface TimelineQueryParams {
  readonly type: PostsQueryType.TIMELINE;
}

type PostsQueryParams = TimelineQueryParams | DiscoveryQueryParam;

interface OffsetLimitPostQueryVariables extends OperationVariables {
  readonly offset: number;
  readonly limit: number;
}

interface PostQueryVariables extends OffsetLimitPostQueryVariables {}

const useQueryParams = (type: PostsQueryType) => {
  return useMemo(() => {
    return { type };
  }, [type]);
};

/**
 * Hook that returns the query data for the posts query.
 * @param params Parameters that define the query type.
 */
const useQueryData = (params: PostsQueryParams): QueryOptions<PostQueryVariables> => {
  const getDiscoveryQuery = useCallback(
    () => ({
      query: GetPosts,
      variables: { offset: 0, limit: 20 },
    }),
    [],
  );

  const getTimelineQuery = useCallback(
    () => ({
      query: GetFollowingUsersPosts,
      variables: { offset: 0, limit: 20 },
    }),
    [],
  );

  return useMemo(() => {
    if (params.type === PostsQueryType.TIMELINE) {
      return getTimelineQuery();
    }
    return getDiscoveryQuery();
  }, [getDiscoveryQuery, getTimelineQuery, params]);
};

/**
 * Hook that returns the posts for the given query type.
 * @param queryType
 */
const usePosts = (queryType: PostsQueryType) => {
  const activeAccountAddress = useActiveAccountAddress();
  const followingAddresses = useFollowingAddresses();
  const queryParams = useQueryParams(queryType);
  const queryData = useQueryData(queryParams);
  const storePosts = useStorePosts(activeAccountAddress!);

  const convertData = useCallback((data: any): Post[] => {
    return (data?.posts ?? []).map(convertGraphQLPost);
  }, []);

  const { items, loading, refresh, refreshing, fetchMore, fetchingMore, error } = usePaginatedQuery(
    {
      query: queryData.query,
      queryOptions: {
        itemsPerPage: queryData.variables?.limit ?? 20,
      },
      variables: {
        ...queryData.variables,
      },
      convertData,
    },
  );

  useEffect(() => {
    storePosts(currentPosts => {
      const filteredPosts = items.filter(p => p.author);
      const [merged] = mergePosts(currentPosts, filteredPosts);
      return merged;
    });
  }, [items, storePosts]);

  const discoveryPosts = useStoredRootPosts(activeAccountAddress!);
  const timelinePosts = useStoredFollowingPosts(activeAccountAddress!, followingAddresses);

  const posts = useMemo(() => {
    return queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts;
  }, [queryType, timelinePosts, discoveryPosts]);

  return {
    posts,
    loading,
    fetchMore,
    fetchingMore,
    refresh,
    refreshing,
    error,
  };
};

export default usePosts;
