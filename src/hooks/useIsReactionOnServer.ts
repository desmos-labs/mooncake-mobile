import { useQuery } from '@apollo/client';
import GetPostReactionsForUser from 'services/graphql/queries/GetPostReactionsForUser';
import { useMemo } from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { Post } from 'types/posts';

/**
 * Hook that allows to know if the reaction to a given post, from the current application user,
 * is stored remotely or not.
 * @param post {Post} - Post for which to check if the reaction is on the server.
 */
const useIsReactionOnServer = (post: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if a post reaction is stored remotely, without active user');
  }

  const { data, refetch } = useQuery(GetPostReactionsForUser, {
    fetchPolicy: 'cache-and-network',
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
      userAddress: activeAddress,
    },
  });

  const isReactionPresent = useMemo(() => data?.reactions?.length > 0, [data]);

  return {
    isReactionPresent,
    refetch,
  };
};

export default useIsReactionOnServer;
