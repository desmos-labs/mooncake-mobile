import React from 'react';
import { useActiveAccountAddress } from '@recoil/accounts';

/**
 * A hook that checks if a given post was created by the current active user.
 */
const useIsAuthorActiveUser = (addressToCheck: string) => {
  const activeAccountAddress = useActiveAccountAddress();

  return React.useMemo(() => {
    return activeAccountAddress === addressToCheck;
  }, [activeAccountAddress, addressToCheck]);
};

export default useIsAuthorActiveUser;
