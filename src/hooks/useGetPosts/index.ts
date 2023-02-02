import React, { useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import _ from 'lodash';
import { followedAddressesState } from '@recoil/following';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import useActiveAccount from 'hooks/useActiveAccount';
import { POST_TYPE, usePostsFamily } from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';

/**
 * Increase this to get more posts per query.
 */
const POSTS_PER_FETCH = 10;

// Get posts up to a given timestamp
const useGetPosts = ({ type }: { type: POST_TYPE }) => {
  const { posts, setPosts } = usePostsFamily(type);
  const { activeAddress } = useActiveAccount();
  const followingAddrs = useRecoilValue(followedAddressesState);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refetching, setRefetching] = useState(false);

  const queryVars = React.useMemo(() => {
    if (type === POST_TYPE.DISCOVER) {
      return {
        query: GetPosts,
        variables: {
          offset: 0,
          limit: POSTS_PER_FETCH,
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          user: activeAddress!,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
        },
      };
    } else {
      return {
        query: GetPostsFromFollowing,
        variables: {
          offset: 0,
          limit: POSTS_PER_FETCH,
          subspaceID: EnvConfig.APP_SUBSPACE_ID,
          following: Array.from(followingAddrs),
          user: activeAddress!,
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: 9,
          },
        },
      };
    }
  }, [followingAddrs, activeAddress]);

  const onCompletedCallback = useCallback((data: any) => {
    const { post } = data;
    setPosts(() => _.uniqBy([...post], 'id'));
  }, []);

  const { refetch, loading, fetchMore } = useQuery(queryVars.query, {
    variables: queryVars.variables,

    onCompleted: onCompletedCallback,
  });

  const fetchMorePosts = React.useCallback(async () => {
    setFetchingMore(true);
    await fetchMore({
      variables: {
        offset: posts.length,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }

        return {
          post: [...prev.post, ...fetchMoreResult.post],
        };
      },
    }).finally(() => setTimeout(() => setFetchingMore(false), 500));
  }, [posts.length, fetchMore]);

  // Reset the fetch offset to restart post fetching
  const fetchNewestPosts = React.useCallback(async () => {
    setRefetching(true);
    await refetch({
      ...queryVars.variables,
      offset: 0,
    }).finally(() => setTimeout(() => setRefetching(false), 500));
  }, [loading, JSON.stringify(queryVars), refetch]);

  /**
   * Refetch following post data if the user has followed/unfollowed a new user, or
   * has switched accounts
   */
  React.useEffect(() => {
    if (type === POST_TYPE.FOLLOWING) {
      fetchNewestPosts();
    }
  }, [followingAddrs, activeAddress]);

  return {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading,
    fetchingMore,
    refetching,
  };
};

export default useGetPosts;
