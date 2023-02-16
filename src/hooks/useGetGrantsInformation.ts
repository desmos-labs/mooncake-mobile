import React from 'react';
import GetAuthzGrants from 'services/graphql/queries/GetAuthzGrants';
import { useLazyQuery } from '@apollo/client';
import { convertAuthzGrantsInfo, convertGraphQLFeeGrant } from 'lib/GraphQLUtils/authorizations';
import {
  useStoreAccountAuthorizations,
  useStoredAccountAuthorizationsInfo,
} from '@recoil/authorizations';
import { useAppStateValue } from '@recoil/appState';
import {
  GetAccountFeeGrantAllowance,
  GqlGetAccountFeeGrantAllowance,
} from 'services/graphql/queries/GetAccountFeeGrantAllowance';
import { AllowedMsgAllowanceTypeUrl } from '@desmoslabs/desmjs';
import { RequiredAuthzGrants } from 'config/AutzGrants';
import { FeeGrant, Grant } from 'types/authorizations';

/**
 * Computes the list of missing messages grant.
 * @param userGrants - List of user's grants.
 */
function getMissingAuthzPermissions(userGrants: Grant[]): string[] {
  return RequiredAuthzGrants.filter(
    msgType => userGrants.find(grant => grant.msgTypeUrl === msgType) === undefined,
  );
}

/**
 * Computes the list of missing messages grant.
 * @param feeGrants - List of user's fee grants.
 */
function getMissingFeeGrantPermissions(feeGrants: FeeGrant[]): string[] {
  const today = new Date();
  const msgsWithFeeGrant = feeGrants
    .filter(feeGrant => {
      // Keep the one without expiration date.
      if (feeGrant.expirationDate === undefined) {
        return true;
      }
      // Keep the one that are still valid right now.
      return feeGrant.expirationDate >= today;
    })
    .flatMap(feeGrant => {
      if (feeGrant.allowance.typeUrl === AllowedMsgAllowanceTypeUrl) {
        return feeGrant.allowance.allowedMessages;
      } else {
        return [];
      }
    });

  return RequiredAuthzGrants.filter(msgType => msgsWithFeeGrant.indexOf(msgType) === -1);
}

/**
 * Hook that allows to get the information about the fee and authz grants
 * that the current user has on-chain.
 */
const useGetGrantsInformation = (accountAddress: string, loadFromCache?: boolean) => {
  const butterConfig = useAppStateValue('butterConfig');
  const apisAddress = butterConfig?.desmosAddress;
  if (!apisAddress) {
    throw new Error('Cannot get the grants information without the API address');
  }

  // We use the locally cached authorization info in order to make requests faster and return
  // something even if the queries fail for some reason later on.
  const authorizationsInfo = useStoredAccountAuthorizationsInfo(accountAddress);
  const setAuthorizationInfo = useStoreAccountAuthorizations(accountAddress);

  // Get the queries to get the proper data
  const [queryGetAccountFeeGrantAllowance, { data: feeGrantData }] =
    useLazyQuery<GqlGetAccountFeeGrantAllowance>(GetAccountFeeGrantAllowance, {
      fetchPolicy: 'no-cache',
      variables: {
        granteeAddress: apisAddress,
        granterAddress: accountAddress,
      },
    });

  const [queryGetAuthzGrants, { data: authzGrantsData }] = useLazyQuery(GetAuthzGrants, {
    fetchPolicy: 'no-cache',
    variables: {
      userAddress: apisAddress,
      granterAddress: accountAddress,
    },
  });

  // React to the changes in either the feegrant or authz data
  React.useEffect(() => {
    // Update the cached authorization info only if the server responds with something
    setAuthorizationInfo(currentVall => {
      const authz = authzGrantsData ? convertAuthzGrantsInfo(authzGrantsData) : currentVall.authz;
      const missingAuthzPermissions =
        currentVall.authz !== authz
          ? getMissingAuthzPermissions(currentVall.authz.grants)
          : currentVall.missingAuthzPermissions;

      const feeGrants = feeGrantData
        ? feeGrantData.fee_grant.map(convertGraphQLFeeGrant)
        : currentVall.feeGrants;
      const missingFeeGrantPermissions =
        currentVall?.feeGrants !== feeGrants
          ? getMissingFeeGrantPermissions(feeGrants)
          : currentVall.missingFeeGrantPermissions;

      return {
        feeGrants,
        authz,
        missingAuthzPermissions,
        missingFeeGrantPermissions,
      };
    });
  }, [feeGrantData, authzGrantsData, setAuthorizationInfo]);

  // Combine the two refetch functions together
  const refetch = React.useCallback(() => {
    queryGetAccountFeeGrantAllowance();
    queryGetAuthzGrants();
  }, [queryGetAccountFeeGrantAllowance, queryGetAuthzGrants]);

  const haveAllPermissions = React.useMemo(() => {
    return (
      authorizationsInfo.missingFeeGrantPermissions.length === 0 &&
      authorizationsInfo.missingAuthzPermissions.length === 0
    );
  }, [authorizationsInfo]);

  React.useEffect(() => {
    if (loadFromCache !== true) {
      refetch();
    }
  }, [loadFromCache, refetch]);

  return {
    info: authorizationsInfo,
    haveAllPermissions,
    refetch,
  };
};

export default useGetGrantsInformation;
