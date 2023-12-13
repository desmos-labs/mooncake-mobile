import { useLazyQuery } from '@apollo/client';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import React from 'react';
import GetPostReactions from 'services/graphql/queries/GetPostReactions';
import { GqlPostReactions, PostReaction } from 'types/desmos';

/**
 * Hook that provides a function that can be used inside the usePaginatedData
 * hook to fetch the current user's liked events.
 */
const useFetchPostReactions = (postId: number) => {
  const [fetchPostReactions] = useLazyQuery<GqlPostReactions>(GetPostReactions);

  return React.useCallback<FetchDataFunction<PostReaction>>(
    async (offset, limit) => {
      const { data, error } = await fetchPostReactions({
        fetchPolicy: 'no-cache',
        variables: {
          postId,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }
      const reactions =
        data?.reactions?.map(reaction => {
          return convertGraphQLReaction(reaction);
        }) ?? [];

      return {
        data: reactions,
        endReached: reactions.length < limit,
      };
    },
    [fetchPostReactions, postId],
  );
};

/**
 * Hook that allows to get the reactions for the given post.
 * The reactions retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the reactions.
 * @param reactionsPerPage {number} - Number of reactions to be fetched per page
 */
/**
 * Hook that allows the fetch the liked events in a paginated way.
 * This hook will also take care of caching the liked events that are fetched.
 */
const usePostReactions = (postId: number) => {
  const paginatedDataFields = usePaginatedData(useFetchPostReactions(postId), {
    itemsPerPage: 20,
    // Logic to always fetch the first page even if we already have cached data.
    autoFetchFirstPage: true,
  });

  return {
    ...paginatedDataFields,
  };
};

export default usePostReactions;
