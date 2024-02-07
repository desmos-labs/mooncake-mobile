import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { useCallback } from 'react';
import GetPostsCreatedByUser from 'services/graphql/queries/GetPostsCreatedByUser';
import { Post } from 'types/posts';

/**
 * Hook that allows to retrieve the posts associated to an address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsCreatedByAddress = (address: string, postsPerPage: number = 25) => {
  const convertData = useCallback((data: any): Post[] => {
    return (data?.posts ?? []).map(convertGraphQLPost);
  }, []);

  return usePaginatedQuery({
    query: GetPostsCreatedByUser,
    queryOptions: {
      itemsPerPage: postsPerPage,
    },
    variables: {
      user: address,
    },
    convertData,
  });
};

export default usePostsCreatedByAddress;
