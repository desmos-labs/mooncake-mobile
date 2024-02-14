import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLReaction } from 'lib/GraphQLUtils/reactions';
import { useCallback } from 'react';
import GetPostReactions from 'services/graphql/queries/GetPostReactions';
import { GqlPostReactions } from 'types/desmos';

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
  const convertData = useCallback((data?: GqlPostReactions) => {
    return (data?.reactions ?? []).map(convertGraphQLReaction);
  }, []);

  return usePaginatedQuery({
    query: GetPostReactions,
    queryOptions: {
      itemsPerPage: 10,
    },
    variables: {
      postId,
    },
    convertData,
  });
};

export default usePostReactions;
