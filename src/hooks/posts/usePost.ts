import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import { isEqual } from 'lodash';
import { useMemo } from 'react';
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

  // Query the post from the GraphQL server
  const { data, refetch, loading } = useQuery(GetPostByID, {
    refetchWritePolicy: 'overwrite',
    variables: {
      postId,
    },
  });

  /**
   * Update the post state with the new post whenever the data changes
   */
  const post: Post | undefined = useMemo(() => {
    if (!data || !data?.posts || !data?.posts[0]) {
      return storedPost;
    }
    const fetchedPost = data.posts[0];
    const convertedPost = fetchedPost ? convertGraphQLPost(fetchedPost) : undefined;
    return isEqual(fetchedPost, convertedPost) ? fetchedPost : convertedPost;
  }, [data, storedPost]);

  return {
    loading,
    post,
    refetch,
  };
};

export default usePost;
