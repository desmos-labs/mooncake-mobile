import React from 'react';
import usePostsCreatedByAddress from 'hooks/usePostsCreatedByAddress';
import usePostsLikedByAddress from 'hooks/usePostsLikedByAddress';
import usePostsTippedByAddress from 'hooks/usePostsTippedByAddress';

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

  const {
    posts: postsTipped,
    loading: arePostsTippedLoading,
    refetch: refetchPostsTipped,
  } = usePostsTippedByAddress(address, postsLimit);

  const refetch = React.useCallback(async () => {
    refetchPostsCreated();
    refetchPostsLiked();
    refetchPostsTipped();
  }, [refetchPostsCreated, refetchPostsLiked, refetchPostsTipped]);

  return {
    posts: [...postsCreated, ...postsLiked, ...postsTipped].slice(0, postsLimit),
    loading: arePostsCreatedLoading || arePostsLikedLoading || arePostsTippedLoading,
    refetch,
  };
};

export default usePostsByAddress;
