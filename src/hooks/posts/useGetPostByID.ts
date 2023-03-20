import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue } from '@recoil/appState';
import { useLazyQuery } from '@apollo/client';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import React from 'react';
import { Post } from 'types/posts';
import { getLikeReactionId } from 'types/desmos';
import { convertGraphQLPost } from 'lib/GraphQLUtils';

/**
 * Hook that allows to get the data of a post given its subspace id and id.
 */
const useGetPostByID = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get post data without active user');
  }

  const subspaceParams = useAppStateValue('subspaceParams');

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
          reaction: {
            '@type': '/desmos.reactions.v1.RegisteredReactionValue',
            registered_reaction_id: getLikeReactionId(subspaceParams),
          },
        },
      });
      if (!data) {
        return undefined;
      }

      return data.posts.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [activeAddress, getPost, subspaceParams],
  );
};

export default useGetPostByID;
