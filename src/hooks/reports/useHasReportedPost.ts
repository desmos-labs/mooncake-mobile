import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';
import GetReportsByUser from 'services/graphql/queries/GetReportsByUser';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';

/**
 * Hook that returns a function allowing to determine if the current application user has already reported a post.
 */
const useHasReportedPost = () => {
  const activeAddress = useActiveAccountAddress();

  const [getLazyData] = useCustomLazyQuery(GetReportsByUser);
  return React.useCallback(
    async (subspaceId: number, postId: number) => {
      if (!activeAddress) {
        return false;
      }

      const data = await getLazyData({
        variables: {
          subspaceId,
          target: { post_id: postId.toString() },
          user: activeAddress,
        },
      });
      return data?.reports?.length > 0;
    },
    [activeAddress, getLazyData],
  );
};

export default useHasReportedPost;
