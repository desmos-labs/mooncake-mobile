import { useActiveAccountAddress } from '@recoil/accounts';
import React from 'react';
import { Post } from 'types/posts';
import { convertGraphQLPost } from 'lib/GraphQLUtils';
import GetPostByExternalID from 'services/graphql/queries/GetPostByExternalID';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that allows to get the data of a post given its subspace id and external id.
 */
const useGetPostByExternalID = () => {
  const activeAddress = useActiveAccountAddress();

  const [getLazyData] = useCustomLazyQuery(GetPostByExternalID);

  return React.useCallback(
    async (externalId: string): Promise<Post | undefined> => {
      if (!activeAddress) {
        throw new Error('Trying to get post data without active user');
      }

      const data = await getLazyData({
        variables: {
          externalId,
        },
      });
      if (!data) {
        return undefined;
      }

      return data.posts.length > 0 ? convertGraphQLPost(data.posts[0]) : undefined;
    },
    [activeAddress, getLazyData],
  );
};

export default useGetPostByExternalID;
