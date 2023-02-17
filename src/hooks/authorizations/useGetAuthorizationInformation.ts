import React from 'react';
import GetAccountAuthzGrants, {
  GQLGetAccountAuthzGrants,
} from 'services/graphql/queries/GetAccountAuthzGrants';
import { useLazyQuery } from '@apollo/client';
import { convertGraphQLAuthzGrant, convertGraphQLFeeGrant } from 'lib/GraphQLUtils/authorizations';
import { useAppStateValue } from '@recoil/appState';
import {
  GetAccountFeeGrantAllowance,
  GqlGetAccountFeeGrantAllowance,
} from 'services/graphql/queries/GetAccountFeeGrantAllowance';
import { err, ok, ResultAsync } from 'neverthrow';

/**
 * Hook to get the fee grants and authz grants of a user's account.
 * @param accountAddress - Address of the account of interest.
 * @param lazy - Whether to use lazy loading.
 */
const useGetAuthorizationInformation = (accountAddress: string, lazy?: boolean) => {
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig?.desmosAddress;
  if (!apisAddress) {
    throw new Error('Cannot get the grants information without the API address');
  }

  // Get the queries to get the proper data
  const [
    fetchFeeGrants,
    {
      data: feeGrantData,
      loading: loadingFeeGrant,
      refetch: refetchAccuntFeeGrants,
      error: feeGrantError,
    },
  ] = useLazyQuery<GqlGetAccountFeeGrantAllowance>(GetAccountFeeGrantAllowance, {
    fetchPolicy: 'no-cache',
    variables: {
      granteeAddress: apisAddress,
      granterAddress: accountAddress,
    },
  });

  const [
    fetchAuthzGrants,
    {
      data: authzGrantsData,
      loading: loadingAuthz,
      refetch: refetchAccountAuthzGrants,
      error: authzGrantsError,
    },
  ] = useLazyQuery<GQLGetAccountAuthzGrants>(GetAccountAuthzGrants, {
    fetchPolicy: 'no-cache',
    variables: {
      granteeAddress: apisAddress,
      granterAddress: accountAddress,
    },
  });

  React.useEffect(() => {
    if (lazy !== true) {
      fetchFeeGrants();
      fetchAuthzGrants();
    }

    // Safe to ignore, we want to execute this hook just once if the
    // user didn't set lazy to true.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lazy]);

  // Combine the two refetch functions together
  const refetch = React.useCallback(async () => {
    const feeGrantQueryResult = await ResultAsync.fromPromise(
      refetchAccuntFeeGrants(),
      e => new Error((<Partial<Error> | undefined>e)?.message ?? 'Failed to load fee grants'),
    );
    if (feeGrantQueryResult.isErr()) {
      return err(feeGrantQueryResult.error);
    }

    const authzQueryResult = await ResultAsync.fromPromise(
      refetchAccountAuthzGrants(),
      e => new Error((<Partial<Error> | undefined>e)?.message ?? 'Failed to load authz grants'),
    );
    if (authzQueryResult.isErr()) {
      return err(authzQueryResult.error);
    }

    return ok({
      feeGrants: feeGrantQueryResult.value.data.fee_grant.map(convertGraphQLFeeGrant),
      authzGrants: authzQueryResult.value.data.grants.map(convertGraphQLAuthzGrant),
    });
  }, [refetchAccuntFeeGrants, refetchAccountAuthzGrants]);

  // Convert the fee grants received from graph ql.
  const feeGrants = React.useMemo(() => {
    return feeGrantData?.fee_grant.map(convertGraphQLFeeGrant);
  }, [feeGrantData?.fee_grant]);

  // Convert the authz grants received from graph ql.
  const authzGrants = React.useMemo(() => {
    return authzGrantsData?.grants.map(convertGraphQLAuthzGrant);
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
