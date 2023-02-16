import { convertGraphQLPost } from 'lib/GraphQLUtils';
import usePostsDataByAddress from 'hooks/usePostsDataByAddress';
import GetPostsLikedByUser from 'services/graphql/queries/GetPostsLikedByUser';
import { Post } from 'types/posts';
import { useReactionsToSync } from '@recoil/reactions';
import { DataStatus } from 'types/cache';

/**
 * Hook that allows to retrieve the posts liked by a given address and stored locally.
 * @param address {string} The address of the user to retrieve the posts from.
 */
const useGetLikedPosts = (address: string): Post[] => {
  const reactionsToSync = useReactionsToSync(address);
  return reactionsToSync
    .filter(reaction => reaction.status === DataStatus.CREATED_LOCALLY)
    .map(reaction => reaction.post);
};

/**
 * Hook that allows to retrieve the posts liked by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * If undefined, the current user address will be used.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsLikedByAddress = (address?: string, postsPerPage: number = 50) => {
  return usePostsDataByAddress({
    query: GetPostsLikedByUser,
    address,
    postsPerPage,
    getInitialPosts: useGetLikedPosts,
    queryMapper: (data: any | undefined) => {
      return {
        // We need to extract the post from the reaction object
        posts: (data?.reactions ?? []).map((r: any) => r.post).map(convertGraphQLPost),
      };
    },
  });
};

export default usePostsLikedByAddress;
