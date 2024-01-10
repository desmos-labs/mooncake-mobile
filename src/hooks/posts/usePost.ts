import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useCachedPostById, useStorePost } from '@recoil/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import React from 'react';
import GetPostByID from 'services/graphql/queries/GetPostByID';
import { Post } from 'types/posts';

/**
 * Hook that allows to get the details of a post, or refetch them if needed.
 */
const usePost = (postId: number, storedPost?: Post) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to get the details of a post without an active address');
  }

  const post = useCachedPostById(activeAddress, postId);
  const storePost = useStorePost();

  // Callback to update the cached post after has been fetched.
  const onDataFethed = React.useCallback(
    async (data: any) => {
      const fetchedPost = data?.posts?.at(0);
      if (fetchedPost) {
        storePost(activeAddress, convertGraphQLPost(fetchedPost));
      }
    },
    [activeAddress, storePost],
  );

  // Query the post from the GraphQL server
  const { refetch, loading } = useQuery(GetPostByID, {
    refetchWritePolicy: 'overwrite',
    onCompleted: onDataFethed,
    variables: {
      postId,
    },
  });

  const cachedRefetch = React.useCallback(async () => {
    const apolloResult = await refetch();
    if (apolloResult.error === undefined) {
      onDataFethed(apolloResult.data);
    }
    return apolloResult;
  }, [onDataFethed, refetch]);

  return {
    loading,
    post: post ?? storedPost,
    refetch: cachedRefetch,
  };
};

export default usePost;
