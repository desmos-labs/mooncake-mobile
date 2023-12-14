import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useIsPostHiddenLocally } from '@recoil/hiddenPosts';
import { usePostCommentsToSync } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { mergePosts } from 'lib/PostsUtils';
import { useCallback, useMemo, useState } from 'react';
import GetPostComments from 'services/graphql/queries/GetPostComments';
import { Post } from 'types/posts';

const usePostComments = (post: Pick<Post, 'subspaceId' | 'id'>, commentsPerPage: number = 50) => {
  const activeAccountAddress = useActiveAccountAddress();
  if (!activeAccountAddress) {
    throw new Error('Active user required for post comments');
  }

  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { localHiddenPosts } = useIsPostHiddenLocally();
  const commentsToSync = usePostCommentsToSync(activeAccountAddress, post.subspaceId, post.id);
  const { data, refetch, fetchMore } = useQuery(GetPostComments, {
    variables: { postId: post.id, offset: 0, limit: commentsPerPage },
    refetchWritePolicy: 'overwrite',
  });

  const comments: Post[] | [] = useMemo(() => {
    if (!data && !commentsToSync) {
      return [];
    }
    console.log('Before', commentsToSync.length);
    const notHiddenComments = commentsToSync.filter(
      comment => !localHiddenPosts.includes(comment.id),
    );
    console.log('After', notHiddenComments.length);

    const commentsWithAuthorFiltered = (data?.comments ?? []).filter(
      (comment: Post) => comment.author,
    );
    const onChainComments: Post[] = commentsWithAuthorFiltered.map(convertGraphQLPost);
    const [merged] = mergePosts(notHiddenComments, onChainComments);

    setFetchingMore(false);
    setRefreshing(false);
    setLoading(false);
    return merged;
  }, [data, commentsToSync, localHiddenPosts]);

  const fetchMoreComments = useCallback(async () => {
    try {
      setError(null);
      setFetchingMore(true);
      await fetchMore({
        variables: { offset: comments.length },
        updateQuery: (prev, { fetchMoreResult }) => ({
          comments: fetchMoreResult ? [...prev.comments, ...fetchMoreResult.comments] : prev,
        }),
      });
    } catch (e) {
      setFetchingMore(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [fetchMore, comments.length]);

  const refreshComments = useCallback(async () => {
    try {
      setError(null);
      setRefreshing(true);
      await refetch({ offset: 0 });
    } catch (e) {
      setRefreshing(false);
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [refetch]);

  return {
    loading,
    comments,
    refetch: refreshComments,
    refreshing,
    fetchMore: fetchMoreComments,
    fetchingMore,
    error,
  };
};

export default usePostComments;
