import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasFollowedUser } from '@recoil/relationships';
import React from 'react';

/**
 * Hook that allows to know if the current user is following a given user or not.
 */
const useIsFollowing = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user is following another user, without an active account',
    );
  }

  const hasFollowedUser = useHasFollowedUser();

  return React.useMemo(
    // Do not perform the search if the active address and counterparty are the same
    () => activeAddress !== counterparty && hasFollowedUser(activeAddress, counterparty),
    [activeAddress, counterparty, hasFollowedUser],
  );
};

export default useIsFollowing;
