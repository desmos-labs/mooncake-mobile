import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPosts from 'services/graphql/queries/GetPosts';

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

  const [offset, setOffset] = React.useState(0);

  const {data, refetch} = useQuery(GetPosts, {
    variables: {
      offset,
      limit: POSTS_PER_FETCH,
    },
  });

  const fetchNewPosts = React.useCallback(() => {
    refetch({offset, limit: POSTS_PER_FETCH}).then(() => {
      setOffset(prev => prev + POSTS_PER_FETCH);
    });
  }, [offset]);

  // TODO: need to uniqueBy setPosts to prevent duplicates
  React.useEffect(() => {
    if (data) {
      const {post} = data;
      setPosts(prev => [...prev, ...post]);
    }
  }, [data]);

  return {posts, fetchNewPosts};
};
