import * as React from 'react';
import { useGetCachedIsFollowingUser } from '@recoil/followers';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that returns a function that allows to get whether the current
 * user is following the user having the given counterparty address.
 */
const useGetIsFollowing = () => {
  const isCachedFollowingUser = useGetCachedIsFollowingUser();

  return React.useCallback(
    async (userAddress: string, counterparty: DesmosProfile) => {
      isCachedFollowingUser(userAddress, counterparty);
      return counterparty.isUserFollowing;
    },
    [isCachedFollowingUser],
  );
};

export default useGetIsFollowing;
