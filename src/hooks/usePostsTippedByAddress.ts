import usePostsDataByAddress from 'hooks/usePostsDataByAddress';
import { Post } from 'types/posts';
import GetPostsTippedByUser from 'services/graphql/queries/GetPostsTippedByUser';
import { useTipsToBeSynced } from '@recoil/tips';
import { PostTipTarget, TipTargetType } from 'types/tips';
import { DataStatus } from 'types/cache';
import { convertGraphQLPost, GraphQLPost } from 'lib/GraphQLUtils';

/**
 * Hook that allows to retrieve the posts tipped by a given address and stored locally.
 * @param address {string} The address of the user to retrieve the posts from.
 */
const useGetTippedPosts = (address: string): Post[] => {
  const tipsToSync = useTipsToBeSynced(address);
  return tipsToSync
    .filter(tip => tip.status === DataStatus.CREATED_LOCALLY)
    .filter(tip => tip.target.type === TipTargetType.POST)
    .map(tip => (tip.target as PostTipTarget).post);
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
  return usePostsDataByAddress({
    query: GetPostsTippedByUser,
    address,
    postsPerPage,
    getInitialPosts: useGetTippedPosts,
    queryMapper: (data: any | undefined) => {
      // We need to extract the post from the tip object
      const mappedPosts = (data?.tips ?? []).map((r: any) => r.post).map(convertGraphQLPost);
      return {
        // Make sure the posts are not duplicated
        posts: mappedPosts.filter(onlyUnique),
      };
    },
  });
};

export default usePostsTippedByAddress;
