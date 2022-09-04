import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {GrantEnums} from 'lib/desmos/msgtypes';
import useGetActiveGrants from 'services/axios/requests/GetActiveGrants/useGetActiveGrants';

const useCheckGrants = () => {
  const [activeAddr] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);
  const {getActiveGrants} = useGetActiveGrants();

  /**
   * Convenience function to check if the user has enabled a grant for a given list
   * @param {GrantEnums[]} grantsToCheck - check if user has provided grants for these grants
   * @return GrantEnums[] - an empty array or subset of grantsToCheck that have not yet been granted
   */
  const checkGrants = React.useCallback(
    async (grantsToCheck: GrantEnums[]): Promise<GrantEnums[]> => {
      if (!activeAddr) throw new Error('[checkGrant]: No active address found');

      const grants = await getActiveGrants();

      return grantsToCheck.filter(x => !grants.grants.includes(x));
    },
    [activeAddr],
  );

  return {
    checkGrants,
  };
};

export default useCheckGrants;
