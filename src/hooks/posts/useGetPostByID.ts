import { useActiveAccountAddress } from '@recoil/accounts';
import { useLazyQuery } from '@apollo/client';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import useQueryReactionValue from 'hooks/graphql/useQueryReactionValue';

/**
 * Hook that allows to get the data of a post given its subspace id and id.
 */
const useGetPostByID = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post data without active user');
  }

  const queryReactionValue = useQueryReactionValue();
  const [getPost] = useLazyQuery(GetPostByID, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (subspaceId: number, postId: number): Promise<Post | undefined> => {
      const { data } = await getPost({
        variables: {
          subspaceId,
          postId,
          user: activeAddress,
          reaction: queryReactionValue,
        },
      });
      if (!data) {
        return undefined;
      }

      return data.posts.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [activeAddress, getPost, queryReactionValue],
  );
};

export default useGetPostByID;
