import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import { useAppStateValue } from '@recoil/appState';

/**
 * Hook that returns a function that allows to get whether the current
 * user is following the user having the given counterparty address.
 */
const useGetIsFollowing = () => {
  const subspaceId = useAppStateValue('subspaceId');
  const [getIsFollowing] = useLazyQuery(GetRelationshipForAddress, {});

  return React.useCallback(async (userAddress: string, counterpartyAddress: string) => {
    const { data, error } = await getIsFollowing({
      variables: {
        subspaceId,
        userAddress,
        counterpartyAddress,
      },
    });

    if (error) {
      throw error;
    }

    return data?.relationships?.length > 0;
  }, []);
};

export default useGetIsFollowing;
