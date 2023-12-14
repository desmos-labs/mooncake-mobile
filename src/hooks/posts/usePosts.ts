import { QueryOptions, useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useStoredFollowingPosts, useStoredRootPosts, useStorePosts } from '@recoil/posts';
import useFollowingAddresses from 'hooks/relationships/useFollowingAddresses';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import _ from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GetPosts from 'services/graphql/queries/GetPosts';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';

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

const usePosts = (queryType: PostsQueryType) => {
  const activeAddress = useActiveAccountAddress();
  const followingAddresses = useFollowingAddresses();
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const storePosts = useStorePosts(activeAddress!);
  const discoveryPosts = useStoredRootPosts(activeAddress!);
  const timelinePosts = useStoredFollowingPosts(activeAddress!, followingAddresses);

  const posts = useMemo(() => {
    return queryType === PostsQueryType.TIMELINE ? timelinePosts : discoveryPosts;
  }, [queryType, timelinePosts, discoveryPosts]);

  const onCompletedCallback = useCallback(
    (data: any) => {
      if (!data) {
        setLoading(false);
        return;
      }

      const filteredPosts = data.posts.filter((post: any) => post.author);
      const graphQLPosts = filteredPosts.map(convertGraphQLPost);

      storePosts(cachedPosts => {
        const [merged] = mergePosts(cachedPosts, graphQLPosts);
        return merged;
      });

      setLoading(false);
      setFetchingMore(false);
      setRefreshing(false);
    },
    [storePosts],
  );

  const queryParams = useQueryParams(queryType, followingAddresses);
  const queryData = useQueryData(queryParams);

  const { refetch, fetchMore } = useQuery(queryData.query, {
    fetchPolicy: 'network-only',
    variables: queryData.variables,
    onCompleted: onCompletedCallback,
    refetchWritePolicy: 'overwrite',
  });

  const fetchMorePosts = useCallback(() => {
    if (fetchingMore) {
      return;
    }
    setFetchingMore(true);
    _.debounce(async () => {
      try {
        await fetchMore({
          variables: { offset: posts.length },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult || fetchMoreResult.posts.length === 0) {
              return prev;
            }

            return {
              posts: [...prev.posts, ...fetchMoreResult.posts],
            };
          },
        });
      } catch (e: any) {
        setError(e.toString());
      } finally {
        setFetchingMore(false);
      }
    }, 500)();
  }, [fetchMore, fetchingMore, posts.length]);

  const refreshPosts = useCallback(async () => {
    setError(undefined);
    setRefreshing(true);
    try {
      const { data } = await refetch({ ...queryData.variables, offset: 0 });
      onCompletedCallback(data);
    } catch (e: any) {
      setError(e.toString());
    } finally {
      setRefreshing(false);
    }
  }, [onCompletedCallback, queryData, refetch]);

  useEffect(() => {
    if (!activeAddress) {
    } // Handle no active user scenario
  }, [activeAddress]);

  // Return the hook's API
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
