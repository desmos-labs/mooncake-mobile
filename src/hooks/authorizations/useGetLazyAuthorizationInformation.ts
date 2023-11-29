import React from 'react';
import { convertGraphQLFeeGrant } from 'lib/GraphQLUtils';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import GRANTER_ADDRESS from 'lib/grantsUtils';
import GetAccountFeeGrantAllowance from 'services/graphql/queries/desmos/GetAccountFeeGrantAllowance';

/**
 * Hook to get the fee grants and authz grants of a user's account (lazy mode).
 * must be fetched using the refetch function.
 */
const useGetLazyAuthorizationInformation = () => {
  // TODO replace with address from future configs

  // Get the queries to get the proper data
  const [getLazyData] = useCustomLazyQuery(GetAccountFeeGrantAllowance);

  return React.useCallback(
    async (accountAddress: string) => {
      const result = await getLazyData({
        variables: {
          granteeAddress: accountAddress,
          granterAddress: GRANTER_ADDRESS,
        },
        fetchPolicy: 'network-only',
      });
      const feeGrants = ((result.fee_grants as any[]) ?? []).map(convertGraphQLFeeGrant);
      return {
        feeGrants,
      };
    },
    [getLazyData],
  );
};

export default useGetLazyAuthorizationInformation;
