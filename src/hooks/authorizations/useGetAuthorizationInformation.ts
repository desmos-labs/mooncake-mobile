import React from 'react';
import GetAccountAuthzGrants from 'services/graphql/queries/GetAccountAuthzGrants';
import { useLazyQuery } from '@apollo/client';
import { convertGraphQLAuthzGrant, convertGraphQLFeeGrant } from 'lib/GraphQLUtils/authorizations';
import { useAppStateValue } from '@recoil/appState';
import { GetAccountFeeGrantAllowance } from 'services/graphql/queries/GetAccountFeeGrantAllowance';

/**
 * Hook to get the fee grants and authz grants of a user's account.
 * @param accountAddress - Address of the account of interest.
 * must be fetched using the refetch function.
 */
const useGetAuthorizationInformation = (accountAddress: string) => {
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig?.desmosAddress;

  // Get the queries to get the proper data
  const [fetchFeeGrants] = useLazyQuery(GetAccountFeeGrantAllowance, { fetchPolicy: 'no-cache' });
  const [fetchAuthzGrants] = useLazyQuery(GetAccountAuthzGrants, { fetchPolicy: 'no-cache' });

  return React.useCallback(async () => {
    // Build the query options
    const options = {
      variables: {
        granteeAddress: apisAddress,
        granterAddress: accountAddress,
      },
    };

    // Get the fee grant data
    const { data: feeGrantData } = await fetchFeeGrants(options);
    const feeGrants = ((feeGrantData?.fee_grants as any[]) ?? []).map(convertGraphQLFeeGrant);

    // Get the authz data
    const { data: authzGrantsData } = await fetchAuthzGrants(options);
    const authzGrants = ((authzGrantsData?.grants as any[]) ?? []).map(convertGraphQLAuthzGrant);

    return {
      feeGrants,
      authzGrants,
    };
  }, [accountAddress, apisAddress, fetchAuthzGrants, fetchFeeGrants]);
};

export default useGetAuthorizationInformation;
