import React, { useMemo } from 'react';
import { useActiveAddress } from '@recoil/redesign/wallets';
import { PostID } from 'types/desmos';
import { useQuery } from '@apollo/client';
import GetPostReactionForAddress from 'services/graphql/queries/GetPostReactionForAddress';
import {
  useAddPostReaction,
  useHasPostReaction,
  useRemovePostReaction,
} from '@recoil/redesign/reactions';

/**
 * Hook that allows to know if the current user has reacted to a given post or not.
 * Once the hook is called, a query to the GraphQL server is performed in order to get
 * the most up-to-date result. Once the result has been fetched, it's stored locally in order
 * to optimize later calls.
 */
const useHasReacted = (postId: PostID) => {
  const activeAddress = useActiveAddress();
  if (!activeAddress) {
    throw new Error('Trying to know if the user has reacted to a post, without active user');
  }

  const hasPostReaction = useHasPostReaction();
  const addPostReaction = useAddPostReaction();
  const removePostReaction = useRemovePostReaction();

  // This is the value that is going to be used as source-of-truth.
  // It's always retrieved from the local cache, which is updated as soon
  // as the server returns a valid response
  const hasReacted = useMemo(
    () => hasPostReaction(activeAddress, postId),
    [hasPostReaction, activeAddress, postId],
  );

  const { data, refetch } = useQuery(GetPostReactionForAddress, {
    fetchPolicy: 'cache-and-network',
    variables: {
      postID: postId,
      userAddress: activeAddress,
    },
  });

  // The following callback is used to react to updates of the data returned
  // by the query. The idea is to cache the response inside the Recoil atom,
  // so that we can simply read that value later on
  React.useCallback(() => {
    if (!data) {
      return;
    }

    const reactions = data.reactions as any[];
    const isCached = hasPostReaction(activeAddress, postId);

    if (reactions.length > 0 && !isCached) {
      // If the reaction exists on the server but does not exist on the cache,
      // add it to the cache
      addPostReaction(activeAddress, postId);
    }

    if (reactions.length === 0 && isCached) {
      // If the reaction does not exist on the server but exists on the cache,
      // delete it from the cache
      removePostReaction(activeAddress, postId);
    }
  }, [data, activeAddress, hasPostReaction, addPostReaction, removePostReaction]);

  return {
    hasReacted,
    refetch,
  };
};

export default useHasReacted;
