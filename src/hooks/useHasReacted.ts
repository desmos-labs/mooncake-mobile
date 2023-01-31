import React, {useMemo} from 'react';
import {useActiveAddress} from '@recoil/wallets';
import {PostID} from 'types/desmos';
import {
  useAddPostReaction,
  useHasPostReaction,
  useSetPostReactionStatus,
} from '@recoil/reactions';
import useIsReactionOnServer from 'hooks/useIsReactionOnServer';

/**
 * Hook that allows to know if the current user has reacted to a given post or not.
 * Once the hook is called, a query to the GraphQL server is performed in order to get
 * the most up-to-date result. Once the result has been fetched, it's stored locally in order
 * to optimize later calls.
 */
const useHasReacted = (postId: PostID) => {
  const activeAddress = useActiveAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user has reacted to a post, without active user',
    );
  }

  const hasPostReaction = useHasPostReaction();
  const addPostReaction = useAddPostReaction();
  const removePostReaction = useSetPostReactionStatus();

  // This is the value that is going to be used as source-of-truth.
  // It's always retrieved from the local cache, which is updated as soon
  // as the server returns a valid response
  const hasReacted = useMemo(
    () => hasPostReaction(activeAddress, postId),
    [hasPostReaction, activeAddress, postId],
  );

  // Perform a server query to know if the reaction is stored remotely or not
  const {isReactionPresent: isReactionOnServer, refetch} =
    useIsReactionOnServer(postId);

  // The following effect is used to react to updates of the data returned
  // by the query. The idea is to cache the response inside the Recoil atom,
  // so that we can simply read that value later on
  React.useEffect(() => {
    const isCached = hasPostReaction(activeAddress, postId);
    if (isReactionOnServer && !isCached) {
      // If the reaction exists on the server but does not exist on the cache,
      // add it to the cache
      addPostReaction(activeAddress, postId);
    }

    if (!isReactionOnServer && isCached) {
      // If the reaction does not exist on the server but exists on the cache,
      // delete it from the cache
      removePostReaction(activeAddress, postId);
    }
  }, [
    isReactionOnServer,
    activeAddress,
    hasPostReaction,
    addPostReaction,
    removePostReaction,
  ]);

  return {
    hasReacted,
    refetch,
  };
};

export default useHasReacted;
