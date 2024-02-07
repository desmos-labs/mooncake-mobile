import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { useCallback } from 'react';
import GetPostsLikedByUser from 'services/graphql/queries/GetPostsLikedByUser';
import { Post } from 'types/posts';

/**
 * Hook that allows to retrieve the posts liked by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsLikedByAddress = (address: string, postsPerPage: number = 25) => {
  const convertData = useCallback((data: any): Post[] => {
    return data?.posts?.map(({ post }: { post: any }) => convertGraphQLPost(post)) ?? [];
  }, []);

  return usePaginatedQuery({
    query: GetPostsLikedByUser,
    queryOptions: {
      itemsPerPage: postsPerPage,
    },
    variables: {
      user: address,
    },
    convertData,
  });
};

export default usePostsLikedByAddress;
