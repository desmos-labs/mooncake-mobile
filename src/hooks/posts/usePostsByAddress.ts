import usePostsCreatedByAddress from 'hooks/posts/usePostsCreatedByAddress';
import usePostsLikedByAddress from 'hooks/posts/usePostsLikedByAddress';
import { sortPostsByCreationDate } from 'lib/PostsUtils';
import React from 'react';
import _ from 'lodash';

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
    // Make sure to remove duplicates (posts that are both created and liked by the user)
    const uniquePosts = _.uniqBy([...postsCreated, ...postsLiked], 'externalId');

    // Sort the posts by creation date and return the first `postsLimit` posts
    return sortPostsByCreationDate(uniquePosts).slice(0, postsLimit);
  }, [postsCreated, postsLiked, postsLimit]);

  return {
    posts,
    loading: arePostsCreatedLoading || arePostsLikedLoading,
    refetch,
  };
};

export default usePostsByAddress;
