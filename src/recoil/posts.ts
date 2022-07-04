import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';
import _ from 'lodash';

export const postsState = atom<PostItem[]>({
  key: 'posts',
  default: [],
});

const POSTS_PER_FETCH = 3;

// Get posts up to a given timestamp
// wip: complete this once BDJuno is updated with post queries
// note that posts only have the author's address, will need to make another
// query to retrieve the user's profile
export const useGetPosts = () => {
  const [posts, setPosts] = useRecoilState(postsState);

  // in the future, this value should be passed as either a prop or loaded from
  // recoil
  const subspaceID = 5;

  // useRef instead of state so it doesn't trigger a re-render when the offset
  // is moved
  const newOffset = React.useRef(0);

  const {data, refetch} = useQuery(GetPosts, {
    variables: {
      offset: 0,
      limit: POSTS_PER_FETCH,
      subspaceID,
    },
  });

  const fetchNewPosts = React.useCallback(() => {
    refetch({offset: newOffset.current, limit: POSTS_PER_FETCH}).then(() => {
      newOffset.current += POSTS_PER_FETCH;
    });
  }, [newOffset.current]);

  React.useEffect(() => {
    if (data) {
      const {post} = data;
      setPosts(prev => _.uniqBy([...prev, ...post], 'id'));
    }
  }, [data]);

  return {posts, fetchNewPosts};
};
