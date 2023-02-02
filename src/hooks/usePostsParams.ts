import React from 'react';
import { useQuery } from '@apollo/client';
import { convertGraphQLPostsParams } from 'lib/GraphQLUtils';
import { useDesmosParam, useSetDesmosParam } from '@recoil/desmosParams';
import GetPostsParams from 'services/graphql/queries/GetPostsParams';

/**
 * Hook that allows to get the Desmos profiles params.
 */
const usePostsParams = () => {
  const postsParams = useDesmosParam('posts');
  const setPostsParams = useSetDesmosParam('posts');

  const { data, refetch } = useQuery(GetPostsParams);

  // We use an effect in order to make sure that when the data is fetched from the server,
  // we update the local storage with the new value
  React.useEffect(() => {
    if (!data) {
      return;
    }
    setPostsParams(convertGraphQLPostsParams(data.params.params));
  }, [data, setPostsParams]);

  return {
    params: postsParams,
    refetch,
  };
};

export default usePostsParams;
