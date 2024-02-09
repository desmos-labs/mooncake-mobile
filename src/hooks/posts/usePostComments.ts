import { useActiveAccountAddress } from '@recoil/accounts';
import { useComments, useDeleteComments, useSetComments } from '@recoil/comments';
import { useSetPostCommentsCount } from '@recoil/commentsCount';
import { useUserLocalComments } from '@recoil/localPosts';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import useSyncLocalPosts from 'hooks/posts/useSyncLocalPosts';
import usePaginatedQuery from 'hooks/usePaginatedQuery';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { sortPostsByCreationDate } from 'lib/PostsUtils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import GetPostCommentByID from 'services/graphql/queries/GetPostCommentByID';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { Post } from 'types/posts';

interface PostCommentsProps {
  post: Pick<Post, 'subspaceId' | 'id'>;
  commentId?: number;
  commentsPerPage?: number;
}

/**
 * Hook that allows to get the reactions for the given post.
 * The reactions retrieved are all the ones found on chain, plus all the ones that have been created locally.
 * @param post - Post for which to get the reactions.
 * @param commentId - Comment ID that we want to include in the list of comments.
 * @param reactionsPerPage {number} - Number of reactions to be fetched per page
 */
/**
 * Hook that allows the fetch the liked events in a paginated way.
 * This hook will also take care of caching the liked events that are fetched.
 */
const usePostComments = ({ post, commentId, commentsPerPage = 20 }: PostCommentsProps) => {
  const activeAccountAddress = useActiveAccountAddress();

  const cachedComments = useComments(post.id);
  const localComments = useUserLocalComments(activeAccountAddress, post.id);

  const storeComments = useSetComments();
  const syncLocalPosts = useSyncLocalPosts(activeAccountAddress);
  const setPostCommentsCount = useSetPostCommentsCount();
  const deleteComments = useDeleteComments();

  const [commentIdToExclude, setCommentIdToExclude] = useState(-1);

  /**
   * State to store the comment to add to the list of comments.
   * This is used to add the missing comment to the list of comments when the comment is not found in the list.
   * Only used when the commentId is provided and the user is coming from a specific screen.
   */
  const [commentToAdd, setCommentToAdd] = useState<Post>();
  const [getLazyQuery] = useCustomLazyQuery(GetPostCommentByID, {
    fetchPolicy: 'no-cache',
  });

  /**
   * Function to convert the data fetched from the API to the Post type.
   */
  const convertData = useCallback((data: any): Post[] => {
    return (data?.comments ?? []).map(convertGraphQLPost);
  }, []);

  const onDataFetched = useCallback(
    async (comments: Post[], refreshing: boolean, firstFetch: boolean) => {
      /**
       * If the commentId is provided, we need to check if the comment is in the list of comments.
       * If it's not, we need to fetch the comment and add it on top of the list of comments
       */
      if (commentId && firstFetch) {
        const isCommentInList = comments.some(c => c.id === commentId);
        if (!isCommentInList) {
          const result = await getLazyQuery({
            variables: {
              commentId,
            },
          });
          if (result.comments.length > 0) {
            setCommentIdToExclude(commentId);
            setCommentToAdd(convertGraphQLPost(result.comments[0]));
          }
        }
      }
      syncLocalPosts(comments);
      storeComments(post.id, currentComments => {
        if (refreshing) {
          return comments;
        }
        return [...comments, ...(currentComments ?? [])];
      });
      comments.forEach(c => setPostCommentsCount(c.id, c.commentsCount));
    },
    [commentId, syncLocalPosts, storeComments, post.id, getLazyQuery, setPostCommentsCount],
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
      commentIdToExclude: -1,
    },
    fetchMoreVariables: {
      postId: post.id,
      commentIdToExclude,
    },
    convertData,
    onDataFetched,
  });

  const comments = useMemo(() => {
    if (commentToAdd) {
      const sortedComments = sortPostsByCreationDate([...localComments, ...cachedComments]);
      return [commentToAdd].concat(sortedComments);
    }
    return sortPostsByCreationDate([...localComments, ...cachedComments]);
  }, [localComments, cachedComments, commentToAdd]);

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
