import React from 'react';
import {useRecoilValue} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import _ from 'lodash';
import {followedAddressesState} from '@recoil/following';
import GetPostsFromFollowing from 'services/graphql/queries/GetPostsFromFollowing';
import useActiveAccount from 'hooks/useActiveAccount';

/**
 * Increase this to get more posts per query.
 */
const POSTS_PER_FETCH = 5;

// Get posts up to a given timestamp
const useGetPosts = ({type}: {type: 'discover' | 'following'}) => {
  const [posts, setPosts] = React.useState<PostItem[]>([]);

  const {activeAddress} = useActiveAccount();
  const followingAddrs = useRecoilValue(followedAddressesState);
  // in the future, this value should be passed as either a prop or loaded from
  // recoil
  const subspaceID = 5;

  const queryVars = React.useMemo(() => {
    if (type === 'discover') {
      return {
        query: GetPosts,
        variables: {
          offset: 0,
          limit: POSTS_PER_FETCH,
          subspaceID,
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
          subspaceID,
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
  }, [posts, loading]);

  React.useEffect(() => {
    if (!loading && data) {
      const {post} = data;
      setPosts(prev => _.uniqBy([...prev, ...post], 'id'));
    }
  }, [loading, data]);

  // Reset the fetch offset to restart post fetching
  const fetchNewestPosts = React.useCallback(
    _.throttle(() => {
      setPosts([]);

      refetch({
        ...queryVars.variables,
        offset: 0,
      }).then(a => {
        setPosts(_.get(a, 'data.post'));
      });
    }, 1500),
    [posts, loading],
  );

  return {
    posts,
    fetchMorePosts,
    fetchNewestPosts,
    loading,
  };
};

export default useGetPosts;
