import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useLazyQuery } from '@apollo/client';
import GetReportsByUser from 'services/graphql/queries/GetReportsByUser';

/**
 * Hook that returns a function allowing to determine if the current application user has already reported a post.
 */
const useHasReportedPost = () => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error('Trying to check if a post has been reported without an active account');
  }

  const [getReportsByUser] = useLazyQuery(GetReportsByUser);

  return React.useCallback(
    async (subspaceId: number, postId: number) => {
      const { data } = await getReportsByUser({
        variables: {
          subspaceId,
          target: { post_id: postId.toString() },
          user: activeAddress,
        },
      });
      return data?.reports?.length > 0;
    },
    [activeAddress, getReportsByUser],
  );
};

export default useHasReportedPost;
