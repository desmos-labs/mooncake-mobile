import React from 'react';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import GetPostReactionsCount from 'services/graphql/queries/GetPostReactionsCount';
import useComputePostReactionsCount from 'hooks/reactions/useComputePostReactionsCount';
import { Post, PostData } from 'types/posts';

/**
 * Hook that returns a function allowing to get the posts data from the server.
 * @param userAddress {string} - Address of the current app user.
 */
const useGetPostData = (userAddress: string) => {
  const getServerCount = useCustomLazyQuery(GetPostReactionsCount);
  const computeReactionsCount = useComputePostReactionsCount(userAddress);
  return React.useCallback(
    async (post: Post): Promise<PostData> => {
      const { data } = await getServerCount({
        variables: {
          subspaceId: post.subspaceId,
          postId: post.id,
        },
      });

      const serverCount = data?.reactions?.aggregate?.count || 0;
      const reactionsCount = computeReactionsCount(serverCount, post);
      return {
        ...post,
        reactionsCount,
      } as PostData;
    },
    [computeReactionsCount, getServerCount],
  );
};

export default useGetPostData;
