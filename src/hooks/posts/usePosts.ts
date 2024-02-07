import { QueryOptions } from '@apollo/client';
import { OperationVariables } from '@apollo/client/core';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useUserLocalPosts } from '@recoil/localPosts';
import {
  useStoredFollowingPosts,
  useStoredRootPosts,
  useStoreFollowingPosts,
  useStorePosts,
} from '@recoil/posts';
import useSyncLocalPosts from 'hooks/posts/useSyncLocalPosts';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { sortPostsByCreationDate } from 'lib/PostsUtils';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
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
  const storeFollowingPosts = useStoreFollowingPosts(activeAccountAddress!);
  const localPosts = useUserLocalPosts(activeAccountAddress);
  const syncLocalPosts = useSyncLocalPosts(activeAccountAddress);

  const convertData = useCallback((data: any): Post[] => {
    return (data?.posts ?? []).map(convertGraphQLPost);
  }, []);

  const onDataFetched = useCallback(
    (posts: Post[]) => {
      syncLocalPosts(posts);
      if (queryType === PostsQueryType.DISCOVERY) {
        storePosts(posts);
      } else {
        storeFollowingPosts(posts);
      }
    },
    [queryType, syncLocalPosts, storePosts, storeFollowingPosts],
  );

  const { loading, refresh, refreshing, fetchMore, fetchingMore, error } = usePaginatedQuery({
    query: queryData.query,
    queryOptions: {
      itemsPerPage: queryData.variables?.limit ?? 20,
    },
    variables: {
      ...queryData.variables,
    },
    convertData,
    onDataFetched,
  });

  const discoveryPosts = useStoredRootPosts(activeAccountAddress!);
  const timelinePosts = useStoredFollowingPosts(activeAccountAddress!, followingAddresses);

  const posts = useMemo(() => {
    if (queryType === PostsQueryType.DISCOVERY) {
      return sortPostsByCreationDate(_.uniqBy([...localPosts, ...discoveryPosts], 'externalId'));
    } else {
      return sortPostsByCreationDate(_.uniqBy([...localPosts, ...timelinePosts], 'externalId'));
    }
  }, [queryType, timelinePosts, discoveryPosts, localPosts]);

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
