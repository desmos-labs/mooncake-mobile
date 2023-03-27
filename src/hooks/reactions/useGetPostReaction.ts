import React from 'react';
import GetPostReaction from 'services/graphql/queries/GetPostReaction';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that allows to get the on-chain data for a post reaction from a user, if any.
 */
const useGetPostReaction = () => {
  const getReaction = useCustomLazyQuery(GetPostReaction);
  return React.useCallback(
    async (subspaceId: number, postId: number, user: string) => {
      const data = await getReaction({
        variables: {
          subspaceId,
          postId,
          userAddress: user,
        },
      });

      return data?.reactions?.length > 0 ? convertGraphQLReaction(data.reactions[0]) : undefined;
    },
    [getReaction],
  );
};

export default useGetPostReaction;
