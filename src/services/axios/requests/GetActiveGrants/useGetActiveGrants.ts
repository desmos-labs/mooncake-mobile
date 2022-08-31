import React from 'react';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
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

  return {
    getActiveGrants,
  };
};

export default useGetActiveGrants;
