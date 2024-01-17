import GetPostByID from 'services/graphql/queries/GetPostByID';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that allows to get the data of a post given its subspace id and id.
 */
const useGetPostByID = () => {
  const [getLazyData] = useCustomLazyQuery(GetPostByID, {
    fetchPolicy: 'cache-first',
  });

  return React.useCallback(
    async (postId: number): Promise<Post | undefined> => {
      const data = await getLazyData({
        variables: {
          postId,
        },
      });

      return data?.posts?.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [getLazyData],
  );
};

// Ignore this since we may need this in the future
// when handling the notifications.
// ts-prune-ignore-next
export default useGetPostByID;
