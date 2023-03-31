import React from 'react';
import { useGetPostReactionsDifference } from '@recoil/reactions';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the count of reactions of a given post.
 * @param userAddress {string} - Address of the user for which to get the reactions count.
 */
const useGetComputePostReactionsCount = (userAddress: string) => {
  const getReactionsDifference = useGetPostReactionsDifference(userAddress);
  return React.useCallback(
    (serverCount: number, post: Pick<Post, 'subspaceId' | 'id'>) => {
      const serverReactionsCount = serverCount ?? 0;

      // Get the reactions difference that is stored locally
      const reactionsDifference = getReactionsDifference(post.subspaceId, post.id);

      // Compute the overall reactions count by adding to the server count the local difference
      return Math.max(0, serverReactionsCount + reactionsDifference);
    },
    [getReactionsDifference],
  );
};

export default useGetComputePostReactionsCount;
