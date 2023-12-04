import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { convertGraphQLFeeGrant } from 'lib/GraphQLUtils';
import GRANTER_ADDRESS from 'lib/grantsUtils';
import GetAccountFeeGrantAllowance from 'services/graphql/queries/desmos/GetAccountFeeGrantAllowance';

/**
 * Hook to get the fee grants and authz grants of a user's account.
 * must be fetched using the refetch function.
 */
const useGetAuthorizationInformation = (accountAddress: string) => {
  // TODO replace with address from future configs

  // Get the queries to get the proper data
  const {
    data,
    loading,
    startPolling: startCheckingFeeGrants,
    stopPolling: stopCheckingFeeGrants,
  } = useQuery(GetAccountFeeGrantAllowance, {
    variables: {
      granteeAddress: accountAddress,
      granterAddress: GRANTER_ADDRESS,
    },
    fetchPolicy: 'network-only',
  });

  const feeGrants = useMemo(() => {
    if (!data) return [];
    return ((data.fee_grants as any[]) ?? []).map(convertGraphQLFeeGrant);
  }, [data]);

  return {
    startCheckingFeeGrants,
    stopCheckingFeeGrants,
    feeGrants,
    loading,
  };
};

export default useGetAuthorizationInformation;
