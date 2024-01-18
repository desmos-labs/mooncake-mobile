import { useLazyQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useIsPostHiddenLocally } from '@recoil/hiddenPosts';
import { usePostCommentsToSync } from '@recoil/posts';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import React, { useCallback } from 'react';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { Post } from 'types/posts';

/**
 * Hook that provides a function that can be used inside the usePaginatedData
 * hook to fetch the current user's liked events.
 */
const useFetchComments = (postId: number) => {
  const [fetchPostComments] = useLazyQuery(GetPostComments);

  return React.useCallback<FetchDataFunction<Post>>(
    async (offset, limit) => {
      const { data, error } = await fetchPostComments({
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

      const comments = data?.comments?.map(convertGraphQLPost) ?? [];

      return {
        data: comments,
        endReached: comments.length < limit,
      };
    },
    [fetchPostComments, postId],
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
const usePostComments = (post: Pick<Post, 'subspaceId' | 'id'>, commentsPerPage: number = 20) => {
  const activeAccountAddress = useActiveAccountAddress();
  const { localHiddenPosts } = useIsPostHiddenLocally();
  const commentsToSync = usePostCommentsToSync(activeAccountAddress, post.subspaceId, post.id);

  const mapDataFunction = useCallback(
    (data: Post[]) => {
      if (!commentsToSync) {
        return [];
      }
      const notHiddenComments = commentsToSync.filter(
        comment => !localHiddenPosts.includes(comment.id),
      );
      const onChainComments = (data ?? []).filter((comment: Post) => comment.author);
      const [merged] = mergePosts(notHiddenComments, onChainComments);
      return merged;
    },
    [commentsToSync, localHiddenPosts],
  );

  const paginatedDataFields = usePaginatedData(useFetchComments(post.id), {
    itemsPerPage: commentsPerPage,
    autoFetchFirstPage: true,
    mapData: mapDataFunction,
  });

  return {
    ...paginatedDataFields,
  };
};

export default usePostComments;
