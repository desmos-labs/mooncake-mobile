import React from 'react';
import usePostsCreatedByAddress from 'hooks/posts/usePostsCreatedByAddress';
import usePostsLikedByAddress from 'hooks/posts/usePostsLikedByAddress';

/**
 * Hook that returns the list of all the posts created, liked and tipped by a user.
 * @param address {string} The address of the user to retrieve the posts from.
 * @param postsLimit {number} The number of posts to retrieve.
 */
const usePostsByAddress = (address: string, postsLimit: number = 10) => {
  const {
    posts: postsCreated,
    loading: arePostsCreatedLoading,
    refetch: refetchPostsCreated,
  } = usePostsCreatedByAddress(address, postsLimit);

  const {
    posts: postsLiked,
    loading: arePostsLikedLoading,
    refetch: refetchPostsLiked,
  } = usePostsLikedByAddress(address, postsLimit);

  const refetch = React.useCallback(async () => {
    refetchPostsCreated();
    refetchPostsLiked();
  }, [refetchPostsCreated, refetchPostsLiked]);

  const posts = React.useMemo(() => {
    return [...postsCreated, ...postsLiked].slice(0, postsLimit);
  }, [postsCreated, postsLiked, postsLimit]);

  return {
    posts,
    loading: arePostsCreatedLoading || arePostsLikedLoading,
    refetch,
  };
};

export default usePostsByAddress;
