import { useActiveAccountAddress } from '@recoil/accounts';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that allows to get the data of a post given its subspace id and id.
 */
const useGetPostByID = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post data without active user');
  }

  const [getLazyData] = useCustomLazyQuery(GetPostByID, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (postId: number): Promise<Post | undefined> => {
      const data = await getLazyData({
        variables: {
          postId,
        },
      });

      return data?.posts?.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [getLazyData],
  );
};

export default useGetPostByID;
