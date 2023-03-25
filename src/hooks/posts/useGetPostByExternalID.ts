import { useActiveAccountAddress } from '@recoil/accounts';
import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import GetPostByExternalID from 'services/graphql/queries/GetPostByExternalID';
import useGetQueryReactionValue from 'hooks/graphql/useGetQueryReactionValue';

/**
 * Hook that allows to get the data of a post given its subspace id and external id.
 */
const useGetPostByExternalID = () => {
  const activeAddress = useActiveAccountAddress();

  const getQueryReactionValue = useGetQueryReactionValue();
  const [getPost] = useLazyQuery(GetPostByExternalID, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback(
    async (subspaceId: number, externalId: string): Promise<Post | undefined> => {
      if (!activeAddress) {
        throw new Error('Trying to get post data without active user');
      }

      const { data } = await getPost({
        variables: {
          subspaceId,
          externalId,
          user: activeAddress,
          reaction: getQueryReactionValue(),
        },
      });
      if (!data) {
        return undefined;
      }

      return data.posts.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [activeAddress, getPost, getQueryReactionValue],
  );
};

export default useGetPostByExternalID;
