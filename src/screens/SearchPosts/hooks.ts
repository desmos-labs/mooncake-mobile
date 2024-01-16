import { useLazyQuery } from '@apollo/client';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import React from 'react';
import SearchPosts from 'services/graphql/queries/SearchPosts';
import { Post } from 'types/posts';

interface Filter {
  value: string;
}

/**
 * Hook that provides a function that can be used from usePaginatedData
 * to fetch the validators.
 */
const useSearchPosts = () => {
  const [searchPosts] = useLazyQuery(SearchPosts);

  return React.useCallback<FetchDataFunction<Post, Filter>>(
    async (offset, limit, filter) => {
      if (filter?.value === '') {
        return {
          data: [],
          endReached: true,
        };
      }
      const { data, error } = await searchPosts({
        variables: {
          search: `%${filter?.value}%`,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const posts = data?.posts?.map((post: any) => convertGraphQLPost(post)) ?? ([] as Post[]);

      return {
        data: posts,
        endReached: posts.length < limit,
      };
    },
    [searchPosts],
  );
};

export default useSearchPosts;
