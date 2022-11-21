import React from 'react';
import {useRecoilValue} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import _ from 'lodash';
import {followedAddressesState} from '@recoil/following';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import useActiveAccount from 'hooks/useActiveAccount';
import {POST_TYPE, usePostsFamily} from '@recoil/posts';
import EnvConfig from 'config/EnvConfig';

/**
 * Increase this to get more posts per query.
 */
const POSTS_PER_FETCH = 10;

// Get posts up to a given timestamp
const useGetPosts = ({type}: {type: POST_TYPE}) => {
  const {posts, setPosts} = usePostsFamily(type);

  const {activeAddress} = useActiveAccount();
  const followingAddrs = useRecoilValue(followedAddressesState);

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
  }, [type, followingAddrs, activeAddress]);

  const {data, refetch, loading} = useQuery(queryVars.query, {
    variables: queryVars.variables,
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  });

  const fetchMorePosts = React.useCallback(() => {
    if (loading) return;
    refetch({
      ...queryVars.variables,
      offset: posts.length,
    });
  }, [posts.length, loading, queryVars.variables]);

  React.useEffect(() => {
    if (data) {
      const {post} = data;
      setPosts(prev => _.uniqBy([...prev, ...post], 'id'));
    }
  }, [JSON.stringify(data)]);

  // Reset the fetch offset to restart post fetching
  const fetchNewestPosts = React.useCallback(() => {
    setPosts([]);

    refetch({
      ...queryVars.variables,
      offset: 0,
    }).then(a => {
      setPosts(_.get(a, 'data.post'));
    });
  }, [loading]);

  React.useEffect(() => {
    if (type === POST_TYPE.FOLLOWING) {
      fetchNewestPosts();
    }
  }, [followingAddrs]);

  return {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading,
  };
};

export default useGetPosts;
