import { useQuery } from '@apollo/client';
import { useActiveAccountAddress } from '@recoil/accounts';
import Constants from 'config/Constants';
import { useMemo } from 'react';
import GetBlockedForAddress from 'services/graphql/queries/GetBlockedForAddress';

/**
 * Hook that allows to know if the current user has blocked a given user or not.
 */
const useIsBlocked = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();

  const { data, refetch } = useQuery(GetBlockedForAddress, {
    fetchPolicy: 'network-only',
    variables: {
      subspaceId: Constants.subspaceId,
      blockerAddress: activeAddress,
      blockedAddress: counterparty,
    },
  });

  const isBlocked = useMemo(() => {
    return data?.user_blocks?.length > 0;
  }, [data]);

  return {
    isBlocked,
    refetch,
  };
};

export default useIsBlocked;
