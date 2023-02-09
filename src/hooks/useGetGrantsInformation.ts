import { useActiveAccountAddress } from '@recoil/accounts';
import useButterConfig from 'hooks/useButterConfig';
import React from 'react';
import GetFeeGrantCount from 'services/graphql/GetFeeGrantCount';
import GetAuthzGrants from 'services/graphql/queries/GetAuthzGrants';
import { useQuery } from '@apollo/client';
import { convertAuthzGrantsInfo, convertFeeGrantInfo } from 'lib/GraphQLUtils/authorizations';
import { useStoreAuthorizationsInfo, useStoredAuthorizationInfo } from '@recoil/authorizations';

/**
 * Hook that allows to get the information about the fee and authz grants
 * that the current user has on-chain.
 */
const useGetGrantsInformation = () => {
  const activeAddress = useActiveAccountAddress();

  const { config: butterConfig } = useButterConfig();
  const apisAddress = butterConfig?.desmosAddress;
  if (!apisAddress) {
    throw new Error('Cannot get the grants information without the API address');
  }

  // We use the locally cached authorization info in order to make requests faster and return
  // something even if the queries fail for some reason later on.
  const authorizationsInfo = useStoredAuthorizationInfo();
  const setAuthorizationInfo = useStoreAuthorizationsInfo();

  // Get the queries to get the proper data
  const { data: feeGrantData, refetch: refetchFeeGrantData } = useQuery(GetFeeGrantCount, {
    fetchPolicy: 'no-cache',
    variables: {
      userAddress: apisAddress,
      granterAddress: activeAddress,
    },
  });
  const { data: authzGrantsData, refetch: refetchAuthzGrantsData } = useQuery(GetAuthzGrants, {
    fetchPolicy: 'no-cache',
    variables: {
      userAddress: apisAddress,
      granterAddress: activeAddress,
    },
  });

  // React to the changes in either the feegrant or authz data
  React.useEffect(() => {
    // Update the cached authorization info only if the server responds with something
    setAuthorizationInfo(currentValue => {
      return {
        feeGrant: feeGrantData ? convertFeeGrantInfo(feeGrantData) : currentValue.feeGrant,
        authz: authzGrantsData ? convertAuthzGrantsInfo(authzGrantsData) : currentValue.authz,
      };
    });
  }, [feeGrantData, authzGrantsData, setAuthorizationInfo]);

  // Combine the two refetch functions together
  const refetch = React.useCallback(() => {
    refetchFeeGrantData();
    refetchAuthzGrantsData();
  }, [refetchFeeGrantData, refetchAuthzGrantsData]);

  return {
    info: authorizationsInfo,
    refetch,
  };
};

export default useGetGrantsInformation;
