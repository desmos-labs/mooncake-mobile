import usePostsDataByAddress from 'hooks/posts/usePostsDataByAddress';
import GetPostsCreatedByUser from 'services/graphql/queries/GetPostsCreatedByUser';
import { usePostsToSync } from '@recoil/posts';
import { Post, PostStatus } from 'types/posts';

/**
 * Hook that allows to retrieve the posts created by a given address and stored locally.
 * @param address {string} The address of the user to retrieve the posts from.
 */
const useGetCreatedPosts = (address: string): Post[] => {
  const posts = usePostsToSync(address);
  return posts.filter(post => post.status === PostStatus.CREATED_LOCALLY);
};

/**
 * Hook that allows to retrieve the posts created by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * If undefined, the current user address will be used.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsCreatedByAddress = (address?: string, postsPerPage: number = 50) => {
  return usePostsDataByAddress({
    query: GetPostsCreatedByUser,
    address,
    postsPerPage,
    getInitialPosts: useGetCreatedPosts,
  });
};

export default usePostsCreatedByAddress;
