import usePostsDataByAddress from 'hooks/posts/usePostsDataByAddress';
import GetPostsLikedByUser from 'services/graphql/queries/GetPostsLikedByUser';
import { useGetReactionsToSync } from '@recoil/reactions';
import { DataStatus } from 'types/cache';
import React from 'react';

/**
 * Hook that allows to retrieve the posts liked by a given address and stored locally.
 */
const useGetLikedPosts = () => {
  const getReactionsToSync = useGetReactionsToSync();
  return React.useCallback(
    (address: string) => {
      return getReactionsToSync(address)
        .filter(reaction => reaction.status === DataStatus.CREATED_LOCALLY)
        .map(reaction => reaction.post);
    },
    [getReactionsToSync],
  );
};

/**
 * Hook that allows to retrieve the posts liked by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * If undefined, the current user address will be used.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsLikedByAddress = (address?: string, postsPerPage: number = 50) => {
  const getLikedPosts = useGetLikedPosts();
  return usePostsDataByAddress({
    query: GetPostsLikedByUser,
    address,
    postsPerPage,
    getInitialPosts: getLikedPosts,
    queryMapper: (data: any | undefined) => {
      return {
        // Extract the post from the reaction object
        posts: (data?.reactions ?? []).map((r: any) => r.post),
      };
    },
  });
};

export default usePostsLikedByAddress;
