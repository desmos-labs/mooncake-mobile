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

const useQueryParams = (type: PostsQueryType, followingAddresses: string[]) => {
  return useMemo(() => {
    if (type === PostsQueryType.TIMELINE) {
      return { type, followedUsers: followingAddresses };
    }
    return { type };
  }, [type, followingAddresses]);
};

const useQueryData = (params: PostsQueryParams, postsPerPage = 10): QueryOptions<any> => {
  const getDiscoveryQuery = useCallback(
    () => ({
      query: GetPosts,
      variables: { offset: 0, limit: postsPerPage },
    }),
    [postsPerPage],
  );

  const getTimelineQuery = useCallback(
    (followedUsers: string[]) => ({
      query: GetPostsFromFollowing,
      variables: { following: followedUsers, offset: 0, limit: postsPerPage },
    }),
    [postsPerPage],
  );

  return useMemo(() => {
    if (params.type === PostsQueryType.TIMELINE) {
      const timelineParams = params as TimelineQueryParams;
      return getTimelineQuery(timelineParams.followedUsers);
    }
    return getDiscoveryQuery();
  }, [getDiscoveryQuery, getTimelineQuery, params]);
};

const useFetchPosts = (queryData: QueryOptions<any, any>) => {
  const [fetchPostComments] = useLazyQuery(queryData.query);

  return useCallback<FetchDataFunction<Post>>(async () => {
    const { data, error } = await fetchPostComments({
      fetchPolicy: 'network-only',
      variables: queryData.variables,
    });

    if (error) {
      throw error;
    }

    const posts = data?.posts?.map(convertGraphQLPost) ?? [];

    return {
      data: posts,
      endReached: posts.length < queryData.variables.limit,
    };
  }, [fetchPostComments]);
};

const usePosts = (queryType: PostsQueryType) => {
  const activeAccountAddress = useActiveAccountAddress();
  const followingAddresses = useFollowingAddresses();
  const queryParams = useQueryParams(queryType, followingAddresses);
  const queryData = useQueryData(queryParams);
  const storePosts = useStorePosts(activeAccountAddress!);
  const cachedPosts = useStoredRootPosts(activeAccountAddress!);

  const mapDataFunction = useCallback((data: Post[]) => {
    const filteredPosts = data.filter((post: Post) => post.author);
    const [merged] = mergePosts(cachedPosts, filteredPosts);
    return merged;
  }, []);

  const { loading, refreshing, fetchMore, refresh, error } = usePaginatedData(
    useFetchPosts(queryData),
    {
      itemsPerPage: queryData.variables.limit,
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
