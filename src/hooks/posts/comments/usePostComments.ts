import { useActiveAccountAddress } from '@recoil/accounts';
import { useComments, useDeleteComments, useSetComments } from '@recoil/comments';
import { useSetPostCommentsCount } from '@recoil/commentsCount';
import { useUserLocalComments } from '@recoil/localPosts';
import useSyncLocalPosts from 'hooks/posts/useSyncLocalPosts';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { sortPostsByCreationDate } from 'lib/PostsUtils';
import { useCallback, useEffect, useMemo } from 'react';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { Post } from 'types/posts';

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
  const cachedComments = useComments(post.id);
  const storeComments = useSetComments();
  const syncLocalPosts = useSyncLocalPosts(activeAccountAddress);
  const localComments = useUserLocalComments(activeAccountAddress, post.id);
  const deleteComments = useDeleteComments();
  const setPostCommentsCount = useSetPostCommentsCount();

  const convertData = useCallback((data: any): Post[] => {
    return (data?.comments ?? []).map(convertGraphQLPost);
  }, []);

  const onDataFetched = useCallback(
    (comments: Post[]) => {
      syncLocalPosts(comments);
      storeComments(post.id, comments);
      comments.forEach(c => setPostCommentsCount(c.id, c.commentsCount));
    },
    [syncLocalPosts, storeComments, post.id, setPostCommentsCount],
  );

  useEffect(() => {
    return () => deleteComments(post.id);
  }, [deleteComments, post.id]);

  const { loading, refresh, refreshing, fetchMore, fetchingMore, error } = usePaginatedQuery({
    query: GetPostComments,
    queryOptions: {
      itemsPerPage: commentsPerPage,
    },
    variables: {
      postId: post.id,
    },
    convertData,
    onDataFetched,
  });

  const comments = useMemo(() => {
    return sortPostsByCreationDate([...localComments, ...cachedComments]);
  }, [localComments, cachedComments]);

  return {
    comments,
    loading,
    refresh,
    refreshing,
    fetchMore,
    fetchingMore,
    error,
  };
};

export default usePostComments;
