import { useActiveAccountAddress } from '@recoil/accounts';
import { useHasFollowedUser } from '@recoil/relationships';
import React from 'react';
import useRefreshRelationshipCache from 'hooks/relationships/useRefreshRelationshipCache';

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

  // Use the cached value in order to avoid unnecessary queries
  const hasFollowedUser = useHasFollowedUser();
  const isFollowing = React.useMemo(
    // Do not perform the search if the active address and counterparty are the same
    () => activeAddress !== counterparty && hasFollowedUser(activeAddress, counterparty),
    [activeAddress, counterparty, hasFollowedUser],
  );

  // Allow to refresh the value when needed
  const updateRelationshipsCache = useRefreshRelationshipCache();
  const refetch = React.useCallback(async () => {
    await updateRelationshipsCache(counterparty);
  }, [counterparty, updateRelationshipsCache]);

  return {
    isFollowing,
    refetch,
  };
};

export default useIsFollowing;
