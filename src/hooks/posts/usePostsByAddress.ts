import usePostsCreatedByAddress from 'hooks/posts/usePostsCreatedByAddress';
import usePostsLikedByAddress from 'hooks/posts/usePostsLikedByAddress';
import { sortPostsByCreationDate } from 'lib/PostsUtils';
import React from 'react';

/**
 * Hook that returns the list of all the posts created, liked and tipped by a user.
 * @param address {string} The address of the user to retrieve the posts from.
 * @param postsLimit {number} The number of posts to retrieve.
 */
const usePostsByAddress = (address: string, postsLimit: number = 10) => {
  const {
    items: postsCreated,
    loading: arePostsCreatedLoading,
    refresh: refetchPostsCreated,
  } = usePostsCreatedByAddress(address, postsLimit);

  const {
    items: postsLiked,
    loading: arePostsLikedLoading,
    refresh: refetchPostsLiked,
  } = usePostsLikedByAddress(address, postsLimit);

  const refetch = React.useCallback(async () => {
    refetchPostsCreated();
    refetchPostsLiked();
  }, [refetchPostsCreated, refetchPostsLiked]);

  const posts = React.useMemo(() => {
    return sortPostsByCreationDate([...postsCreated, ...postsLiked]);
  }, [postsCreated, postsLiked]);

  return {
    posts,
    loading: arePostsCreatedLoading || arePostsLikedLoading,
    refetch,
  };
};

export default usePostsByAddress;
