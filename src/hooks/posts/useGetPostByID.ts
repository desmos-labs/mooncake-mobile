import { useActiveAccountAddress } from '@recoil/accounts';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import useGetQueryReactionValue from 'hooks/graphql/useGetQueryReactionValue';

/**
 * Hook that allows to get the data of a post given its subspace id and id.
 */
const useGetPostByID = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post data without active user');
  }

  const getQueryReactionValue = useGetQueryReactionValue();
  const { getLazyData: getPost } = useCustomLazyQuery(GetPostByID);

  return React.useCallback(
    async (subspaceId: number, postId: number): Promise<Post | undefined> => {
      const data = await getPost({
        variables: {
          subspaceId,
          postId,
          user: activeAddress,
          reaction: getQueryReactionValue(),
        },
      });

      return data?.posts?.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [activeAddress, getPost, getQueryReactionValue],
  );
};

export default useGetPostByID;
