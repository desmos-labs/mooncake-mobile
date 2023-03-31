import { useQuery } from '@apollo/client';
import GetPostReactionsCount from 'services/graphql/queries/GetPostReactionsCount';
import { useActiveAccountAddress } from '@recoil/accounts';
import { Post } from 'types/posts';
import useComputePostReactionsCount from 'hooks/reactions/useComputePostReactionsCount';
import { useMemo } from 'react';

/**
 * Hook that allows to get the count of reactions of a given post.
 * @param post {Post} - Post for which to get the reactions count.
 */
const usePostReactionsCount = (post: Pick<Post, 'subspaceId' | 'id'>) => {
  const address = useActiveAccountAddress();

  if (!address) {
    throw new Error("Trying to get a post's reactions count, without an active address");
  }

  // Get the reactions count from the server
  const { data, loading, refetch } = useQuery(GetPostReactionsCount, {
    variables: {
      subspaceId: post.subspaceId,
      postId: post.id,
    },
  });

  // Compute the real reactions count
  const getReactionsCount = useComputePostReactionsCount(address);
  const reactionsCount = useMemo(
    () => getReactionsCount(data?.reactions?.aggregate?.count, post),
    [data, getReactionsCount, post],
  );

  return {
    count: reactionsCount,
    loading,
    refetch,
  };
};

export default usePostReactionsCount;
