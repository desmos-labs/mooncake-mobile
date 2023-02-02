import {PostID} from 'types/desmos';
import {useQuery} from '@apollo/client';
import GetPostReactionForAddress from 'services/graphql/queries/GetPostReactionForAddress';
import {useMemo} from 'react';
import {useActiveAccountAddress} from '@recoil/wallets';

/**
 * Hook that allows to know if the reaction to a given post, from the current application user,
 * is stored remotely or not.
 * @param postId {PostID} - Id of the post for which to check the user's reaction presence.
 */
const useIsReactionOnServer = (postId: PostID) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if a post reaction is stored remotely, without active user',
    );
  }

  const {data, refetch} = useQuery(GetPostReactionForAddress, {
    fetchPolicy: 'cache-and-network',
    variables: {
      postID: postId,
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
