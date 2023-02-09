import React, { useState } from 'react';
import { Post } from 'types/posts';
import { PostTip } from 'types/desmos';

/**
 * Hook that allows to get the tips for the given post.
 * The tips retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the tips.
 * TODO: Implement this
 */
const useGetPostTips = (post: Post) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [tips, setTips] = useState<PostTip[]>([]);
  const refetch = React.useCallback(() => {}, []);
  const fetchMore = React.useCallback(() => {}, []);
  return {
    loading,
    tips,
    refetch,
    fetchMore,
  };
};

export default useGetPostTips;
