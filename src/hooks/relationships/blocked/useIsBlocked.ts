import { useActiveAccountAddress } from '@recoil/accounts';
import React from 'react';
import { useHasBlockedUser } from '@recoil/blockedRelationships';
import useRefreshBlockedRelationshipCache from 'hooks/relationships/blocked/useRefreshBlockedRelationshipCache';

/**
 * Hook that allows to know if the current user has blocked a given user or not.
 */
const useIsBlocked = (counterparty: string) => {
  const activeAddress = useActiveAccountAddress();
  if (!activeAddress) {
    throw new Error(
      'Trying to know if the user is blocking another user, without an active account',
    );
  }

  // Use the cached value in order to avoid unnecessary queries
  const hasBlockedUser = useHasBlockedUser();
  const isBlocked = React.useMemo(
    // Do not perform the search if the active address and counterparty are the same
    () => activeAddress !== counterparty && hasBlockedUser(activeAddress, counterparty),
    [activeAddress, counterparty, hasBlockedUser],
  );

  // Allow to refresh the value when needed
  const updateBlockedRelationshipCache = useRefreshBlockedRelationshipCache();
  const refetch = React.useCallback(async () => {
    await updateBlockedRelationshipCache(counterparty);
  }, [counterparty, updateBlockedRelationshipCache]);

  return {
    isBlocked,
    refetch,
  };
};

export default useIsBlocked;
