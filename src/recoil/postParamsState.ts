import {atom, useSetRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetPostParams from 'services/graphql/queries/GetPostParams';
import React from 'react';

type PostParams = {
  max_text_length: number;
};

export const postParamsState = atom<PostParams>({
  key: 'postParams',
  default: {
    max_text_length: 500,
  },
});

/**
 * Initializes the post params atom.
 */
export const useInitializePostParams = () => {
  const setPostParams = useSetRecoilState(postParamsState);

  const {data} = useQuery(GetPostParams);

  React.useEffect(() => {
    if (!data) return;

    const {posts_params} = data;
    const [first] = posts_params;

    const {params} = first;

    setPostParams(params);
  }, [data]);
};
