import React from 'react';
import GetAccountAuthzGrants, {
  GQLGetAccountAuthzGrants,
} from 'services/graphql/queries/GetAccountAuthzGrants';
import { useQuery } from '@apollo/client';
import { convertGraphQLAuthzGrant, convertGraphQLFeeGrant } from 'lib/GraphQLUtils/authorizations';
import { useAppStateValue } from '@recoil/appState';
import {
  GetAccountFeeGrantAllowance,
  GqlGetAccountFeeGrantAllowance,
} from 'services/graphql/queries/GetAccountFeeGrantAllowance';

/**
 * Hook that allows to get the information about the fee and authz grants
 * that the current user has on-chain.
 */
const useGetAuthorizationInformation = (accountAddress: string) => {
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig?.desmosAddress;
  if (!apisAddress) {
    throw new Error('Cannot get the grants information without the API address');
  }

  // Get the queries to get the proper data
  const {
    data: feeGrantData,
    loading: loadingFeeGrant,
    refetch: refetchAccuntFeeGrants,
    error: feeGrantError,
  } = useQuery<GqlGetAccountFeeGrantAllowance>(GetAccountFeeGrantAllowance, {
    fetchPolicy: 'no-cache',
    variables: {
      granteeAddress: apisAddress,
      granterAddress: accountAddress,
    },
  });

  const {
    data: authzGrantsData,
    loading: loadingAuthz,
    refetch: refetchAccountAuthzGrants,
    error: authzGrantsError,
  } = useQuery<GQLGetAccountAuthzGrants>(GetAccountAuthzGrants, {
    fetchPolicy: 'no-cache',
    variables: {
      granteeAddress: apisAddress,
      granterAddress: accountAddress,
    },
  });

  // Combine the two refetch functions together
  const refetch = React.useCallback(async () => {
    const feeGrantQueryResult = await refetchAccuntFeeGrants();
    const authzQueryResult = await refetchAccountAuthzGrants();

    return {
      error: feeGrantQueryResult.error ?? authzQueryResult?.error,
      loading: feeGrantQueryResult.loading || authzQueryResult.loading,
      feeGrants: feeGrantQueryResult?.data.fee_grant.map(convertGraphQLFeeGrant) ?? [],
      authzGrants: authzQueryResult?.data.grants.map(convertGraphQLAuthzGrant) ?? [],
    };
  }, [refetchAccuntFeeGrants, refetchAccountAuthzGrants]);

  // Convert the fee grants received from graph ql.
  const feeGrants = React.useMemo(() => {
    return feeGrantData?.fee_grant.map(convertGraphQLFeeGrant) ?? [];
  }, [feeGrantData?.fee_grant]);

  // Convert the authz grants received from graph ql.
  const authzGrants = React.useMemo(() => {
    return authzGrantsData?.grants.map(convertGraphQLAuthzGrant) ?? [];
  }, [authzGrantsData?.grants]);

  // Combine the two loading flags.
  const loading = React.useMemo(() => {
    return loadingFeeGrant || loadingAuthz;
  }, [loadingFeeGrant, loadingAuthz]);

  // Combine the two errors.
  const error = React.useMemo(() => {
    return feeGrantError ?? authzGrantsError;
  }, [authzGrantsError, feeGrantError]);

  return {
    feeGrants,
    authzGrants,
    loading,
    error,
    refetch,
  };
};

export default useGetAuthorizationInformation;
