import {
  useAddPostReaction,
  useGetPostReaction,
  useRemovePostReaction,
  useUpdatePostReactionStatus,
} from '@recoil/reactions';
import { useCallback } from 'react';
import { GraphQLPost } from 'lib/GraphQLUtils';
import { DataStatus } from 'types/cache';
import useUpdateCachedData from 'hooks/useUpdateCachedData';

/**
 * Hook that allows to update the cached data about the reaction that a user has added/removed from a post.
 * @param activeAddress {string} - Address of the active account.
 */
const useUpdatePostReactionCache = (activeAddress: string) => {
  const getPostReaction = useGetPostReaction(activeAddress);
  const addPostReaction = useAddPostReaction(activeAddress);
  const setPostReactionStatus = useUpdatePostReactionStatus(activeAddress);
  const removePostReaction = useRemovePostReaction(activeAddress);

  const updateCachedData = useUpdateCachedData();

  return useCallback(
    (post: GraphQLPost) => {
      const cachedPostReaction = getPostReaction(post);
      updateCachedData(
        cachedPostReaction,
        post.hasReacted,
        () => addPostReaction(post),
        (status: DataStatus) => setPostReactionStatus(post, status),
        () => removePostReaction(post),
      );
    },
    [addPostReaction, getPostReaction, removePostReaction, setPostReactionStatus, updateCachedData],
  );
};

export default useUpdatePostReactionCache;
