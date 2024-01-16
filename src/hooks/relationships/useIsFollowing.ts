import { useActiveAccountAddress } from '@recoil/accounts';
import { useQuery } from '@apollo/client';
import GetRelationshipForAddress from 'services/graphql/queries/GetRelationshipForAddress';
import { useAppStateValue } from '@recoil/appState';

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
const useIsFollowing = (counterparty: string) => {
  const subspaceId = useAppStateValue('subspaceId');
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user is following another user, without an active account',
    );
  }

  const { data, refetch, loading } = useQuery(GetRelationshipForAddress, {
    variables: {
      subspaceId,
      userAddress: activeAddress,
      counterpartyAddress: counterparty,
    },
  });

  return {
    isFollowing: data?.relationships?.length > 0,
    loading,
    refetch,
  };
};

export default useIsFollowing;
