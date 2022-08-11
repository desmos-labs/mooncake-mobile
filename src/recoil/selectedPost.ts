import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';

export const selectedPostState = atom<PostItem | undefined>({
  key: 'selectedPost',
  default: undefined,
});

// Get posts up to a given timestamp
export const useGetPost = (ID: number) => {
  const [post, setPost] = useRecoilState(selectedPostState);

  // in the future, this value should be passed as either a prop or loaded from
  // recoil
  const subspaceID = 5;
  // const ID = 6;

  const {data, loading, refetch} = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID,
      subspaceID,
    },
  });

  const refetchPost = React.useCallback(() => {
    refetch({ID, subspaceID});
  }, []);

  React.useEffect(() => {
    console.log('new data');
    if (data) {
      setPost(data.posts[0]);
    }
  }, [data]);

  return {post, loading, refetchPost};
};
