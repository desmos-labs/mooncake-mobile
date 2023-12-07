import GetPostsLikedByUser from 'services/graphql/queries/GetPostsLikedByUser';
import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';

/**
 * Hook that provides a function that can be used inside the usePaginatedData
 * hook to fetch the current user's liked events.
 */
const useFetchLikedPosts = (user: string) => {
  const [fetchLikedPosts] = useLazyQuery(GetPostsLikedByUser);

  return React.useCallback<FetchDataFunction<Post>>(
    async (offset, limit) => {
      const { data, error } = await fetchLikedPosts({
        fetchPolicy: 'no-cache',
        variables: {
          user,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const posts = data?.posts?.map(({ post }: { post: any }) => convertGraphQLPost(post)) ?? [];

      return {
        data: posts,
        endReached: posts.length < limit,
      };
    },
    [fetchLikedPosts],
  );
};

/**
 * Hook that allows to retrieve the posts liked by a given address by querying the GraphQL server.
 * @param address The address of the user to retrieve the posts from.
 * If undefined, the current user address will be used.
 * @param postsPerPage The number of posts to retrieve per page.
 */
const usePostsLikedByAddress = (address: string, postsPerPage: number = 50) => {
  const paginatedDataFields = usePaginatedData(useFetchLikedPosts(address), {
    itemsPerPage: postsPerPage,
    // Logic to always fetch the first page even if we already have cached data.
    autoFetchFirstPage: true,
  });

  return {
    ...paginatedDataFields,
  };
};

export default usePostsLikedByAddress;
