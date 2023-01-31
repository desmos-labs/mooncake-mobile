import {PostID} from 'types/desmos';
import {useQuery} from '@apollo/client';
import GetPostReactionsCount from 'services/graphql/queries/GetPostReactionsCount';
import {useHasPostReaction} from '@recoil/reactions';
import {useActiveAddress} from '@recoil/wallets';
import useIsReactionOnServer from 'hooks/useIsReactionOnServer';
import {useMemo} from 'react';

/**
 * Hook that allows to get the count of reactions of a given post.
 */
const useReactionsCount = (postId: PostID) => {
  const address = useActiveAddress();
  if (!address) {
    throw new Error(
      "Trying to get a post's reactions count, without an active address",
    );
  }

  // Check whether the reaction exists locally or not
  const hasPostReaction = useHasPostReaction();
  const hasReactedLocally = useMemo(
    () => hasPostReaction(address, postId),
    [hasPostReaction, address, postId],
  );

  // Check whether the reaction exists on the server or not
  const {isReactionPresent: hasReactedOnServer, refetch: refetchHasReacted} =
    useIsReactionOnServer(postId);

  // Get the reactions count from the server
  const {
    data,
    loading,
    refetch: refetchCount,
  } = useQuery(GetPostReactionsCount, {
    variables: {
      postID: postId,
    },
  });
  const serverReactionsCount = useMemo(
    () => data?.reactions?.aggregate?.count ?? 0,
    [data],
  );

  // Compute the overall reactions count based on:
  // 1. the server reactions count
  // 2. if the reaction exists locally, but not on the server (or vice-versa)
  const reactionsCount = useMemo(() => {
    if (hasReactedLocally && !hasReactedOnServer) {
      // The reaction is present locally, but not on the server.
      // This means the transaction to create it is still being broadcast
      return serverReactionsCount + 1;
    }

    if (!hasReactedLocally && hasReactedOnServer) {
      // The reaction is not present locally, but is present on the server.
      // This means the transaction to delete it is still being broadcast
      return serverReactionsCount - 1;
    }

    // The server and local storage are in sync (both have the reaction, or both don't)
    return serverReactionsCount;
  }, []);

  const refetch = async () => {
    await refetchHasReacted();
    await refetchCount();
  };

  return {
    count: reactionsCount,
    loading,
    refetch,
  };
};

export default useReactionsCount;
