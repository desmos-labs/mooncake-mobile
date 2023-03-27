import { useSetSetting, useSetting } from '@recoil/settings';
import useAddAuthorizations from 'hooks/authorizations/useAddAuthorizations';
import useRemoveAuthorizations from 'hooks/authorizations/useRemoveAuthorizations';
import React from 'react';

/**
 * Hook that provides a function to give or remove to the current user the grants
 * necessary to execute operations on behalf of the user.
 */
const useEnableOrDisableAuthorizations = () => {
  // Settings
  const simplifyTxBroadcast = useSetting('simplifyTxBroadcast');
  const setSimplifyTxBroadcast = useSetSetting('simplifyTxBroadcast');

  // Hooks
  const addAuthorizations = useAddAuthorizations();
  const removeAuthorizations = useRemoveAuthorizations();

  return React.useCallback(
    async (userAddress: string, requiredPermissions: string[]) => {
      const result = simplifyTxBroadcast
        ? await removeAuthorizations(userAddress, requiredPermissions)
        : await addAuthorizations(userAddress, requiredPermissions);

      if (result.isOk()) {
        setSimplifyTxBroadcast(value => !value);
      }
    },
    [addAuthorizations, removeAuthorizations, setSimplifyTxBroadcast, simplifyTxBroadcast],
  );
};

export default useEnableOrDisableAuthorizations;
