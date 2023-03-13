import usePostsDataByAddress from 'hooks/posts/usePostsDataByAddress';
import GetPostsTippedByUser from 'services/graphql/queries/GetPostsTippedByUser';
import { useGetTipsToBeSynced } from '@recoil/tips';
import { PostTipTarget, TipTargetType } from 'types/tips';
import { DataStatus } from 'types/cache';
import { GraphQLPost } from 'lib/GraphQLUtils';
import React from 'react';

/**
 * Hook that allows to retrieve the posts tipped by a given address and stored locally.
 */
const useGetTippedPosts = () => {
  const tipsToSync = useGetTipsToBeSynced();
  return React.useCallback(
    (address: string) =>
      tipsToSync(address)
        .filter(tip => tip.status === DataStatus.CREATED_LOCALLY)
        .filter(tip => tip.target.type === TipTargetType.POST)
        .map(tip => (tip.target as PostTipTarget).post),
    [tipsToSync],
  );
};

/**
 * Function that allows to filter out duplicated posts.
 * @param value The post to check.
 * @param index The index of the post in the array.
 * @param array The array of posts.
 */
function onlyUnique(value: GraphQLPost, index: number, array: GraphQLPost[]) {
  return array.indexOf(value) === index;
}

/**
 * Hook that allows to retrieve the posts tipped by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * If undefined, the current user address will be used.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsTippedByAddress = (address?: string, postsPerPage: number = 50) => {
  const getTippedPosts = useGetTippedPosts();
  return usePostsDataByAddress({
    query: GetPostsTippedByUser,
    address,
    postsPerPage,
    getInitialPosts: getTippedPosts,
    queryMapper: (data: any | undefined) => {
      return {
        // Extract the post from the tip object and make sure the posts are not duplicated
        posts: (data?.tips ?? []).map((r: any) => r.post).filter(onlyUnique),
      };
    },
  });
};

export default usePostsTippedByAddress;
