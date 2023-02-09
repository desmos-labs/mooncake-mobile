import React, { useState } from 'react';
import { PostReaction } from 'types/desmos';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the reactions for the given post.
 * The reactions retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the reactions.
 * TODO: Implement this
 */
const useGetPostReactions = (post: Post) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [reactions, setComments] = useState<PostReaction[]>([]);
  const refetch = React.useCallback(() => {}, []);
  const fetchMore = React.useCallback(() => {}, []);
  return {
    loading,
    reactions,
    refetch,
    fetchMore,
  };
};

export default useGetPostReactions;
