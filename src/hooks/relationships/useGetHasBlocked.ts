import * as React from 'react';
import { useAppStateValue } from '@recoil/appState';
import { useLazyQuery } from '@apollo/client';
import GetBlockedForAddress from 'services/graphql/queries/GetBlockedForAddress';

/**
 * Hook that returns a function to know if a user has blocked another user.
 */
const useGetHasBlocked = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const [hasBlocked] = useLazyQuery(GetBlockedForAddress);

  return React.useCallback(
    async (userAddress: string, counterpartyAddress: string) => {
      const { data, error } = await hasBlocked({
        variables: {
          subspaceId,
          blockerAddress: userAddress,
          blockedAddress: counterpartyAddress,
        },
      });

      if (error) {
        throw error;
      }

      return data?.user_block?.length > 0;
    },
    [hasBlocked, subspaceId],
  );
};

export default useGetHasBlocked;
