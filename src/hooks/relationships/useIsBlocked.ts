import { useActiveAccountAddress } from '@recoil/accounts';
import { useQuery } from '@apollo/client';
import GetBlockedForAddress from 'services/graphql/queries/GetBlockedForAddress';

/**
 * Hook that allows to know if the current user has blocked a given user or not.
 */
const useIsBlocked = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();

  const { data, refetch } = useQuery(GetBlockedForAddress, {
    fetchPolicy: 'network-only',
    variables: {
      blockerAddress: activeAddress,
      blockedAddress: counterparty,
    },
  });

  return {
    isBlocked: data?.user_blocks?.length > 0,
    refetch,
  };
};

export default useIsBlocked;
