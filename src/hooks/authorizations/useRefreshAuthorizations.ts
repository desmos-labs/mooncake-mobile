import React from 'react';
import { getMissingAuthzPermissions, getMissingFeeGrantPermissions } from 'lib/AuthorizationsUtils';
import { useSetSetting } from '@recoil/settings';
import useGetAuthorizationInformation from 'hooks/authorizations/useGetAuthorizationInformation';

/**
 * Hook that provides a function to refresh the authorizations of a given user.
 */
const useRefreshAuthorizations = () => {
  // Hooks
  const setSimplifyTxBroadcast = useSetSetting('simplifyTxBroadcast');
  const getAuthorizations = useGetAuthorizationInformation();

  // Local state
  const [loading, setLoading] = React.useState(true);

  // Callback used to refresh the authorizations
  const refresh = React.useCallback(
    async (accountAddress: string, requiredPermissions: string[]) => {
      setLoading(true);

      // Get the fee grants
      const { feeGrants, authzGrants } = await getAuthorizations(accountAddress);

      // Get the missing permissions
      const missingFeeGrants = getMissingFeeGrantPermissions(requiredPermissions, feeGrants);
      const missingAuthzGrants = getMissingAuthzPermissions(requiredPermissions, authzGrants);

      // Update the permissions state
      setSimplifyTxBroadcast(missingFeeGrants.length === 0 && missingAuthzGrants.length === 0);
      setLoading(false);

      return {
        currentFeeGrants: feeGrants,
        missingFeeGrants,
        currentAuthzGrants: authzGrants,
        missingAuthzGrants,
      };
    },
    [getAuthorizations, setSimplifyTxBroadcast],
  );

  return {
    loading,
    refresh,
  };
};

export default useRefreshAuthorizations;
