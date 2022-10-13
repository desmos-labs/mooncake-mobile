import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import _ from 'lodash';

export const postsState = atom<PostItem[]>({
  key: 'posts',
  default: [],
});

/**
 * Increase this to get more posts per query.
 */
const POSTS_PER_FETCH = 5;

// Get posts up to a given timestamp
export const useGetPosts = () => {
  const [activeAddress] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const [posts, setPosts] = useRecoilState(postsState);

  // in the future, this value should be passed as either a prop or loaded from
  // recoil
  const subspaceID = 5;

  const {data, refetch, loading} = useQuery(GetPosts, {
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
    fetchPolicy: 'no-cache',
    errorPolicy: 'ignore',
  });

  const fetchMorePosts = React.useCallback(() => {
    if (loading) return;
    refetch({
      offset: posts.length,
      limit: POSTS_PER_FETCH,
      subspaceID,
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
        offset: 0,
        limit: POSTS_PER_FETCH,
        subspaceID,
      }).then(a => {
        setPosts(_.get(a, 'data.post'));
      });
    }, 1500),
    [posts, loading],
  );

  return {posts, fetchMorePosts, fetchNewestPosts, loading};
};
