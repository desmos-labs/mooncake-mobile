import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {GrantEnums} from 'lib/desmos/msgtypes';
import GetActiveGrants from './index';

const useGetActiveGrants = () => {
  const [activeAddr] = useMMKVStorage<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

  /**
   * Returns a list of grants enabled by the user.
   */
  const getActiveGrants = React.useCallback(async () => {
    if (!activeAddr) {
      throw new Error('[getActiveGrants]: No active address found');
    }
    return GetActiveGrants({address: activeAddr});
  }, [activeAddr]);

  /**
   * Convenience function to check if the user has enabled a grant for a given list
   */
  const checkGrants = React.useCallback(
    async (
      grantsToCheck: GrantEnums[],
    ): Promise<{[index: string]: boolean}> => {
      if (!activeAddr) throw new Error('[checkGrant]: No active address found');

      const grants = await getActiveGrants();

      if (!grants) return {};

      return grantsToCheck.reduce((acc, cur) => {
        return {
          ...acc,
          [cur]: grants.grants.includes(cur),
        };
      }, {});
    },
    [activeAddr],
  );

  return {
    getActiveGrants,
    checkGrants,
  };
};

export default useGetActiveGrants;
