import React from 'react';
import useUpdateCachedData from 'hooks/useUpdateCachedData';
import { DesmosProfile } from 'types/desmos';
import { DataStatus } from 'types/cache';
import {
  useAddBlockedRelationship,
  useGetBlocked,
  useRemoveBlockedUser,
  useUpdateBlockedRelationshipStatus,
} from '@recoil/blockedRelationships';

/**
 * Hook that allows to update the cached data about the relationships that a user has.
 */
const useUpdateBlockedRelationshipCache = () => {
  const getBlocked = useGetBlocked();
  const addBlocked = useAddBlockedRelationship();
  const setBlockedRelationshipState = useUpdateBlockedRelationshipStatus();
  const removeBlocked = useRemoveBlockedUser();

  const updateCachedData = useUpdateCachedData();

  return React.useCallback(
    (user: string, counterparty: DesmosProfile, isFollowing: boolean) => {
      const cachedRelationship = getBlocked(user, counterparty.address);
      updateCachedData(
        cachedRelationship,
        isFollowing,
        () => addBlocked(user, counterparty),
        (status: DataStatus) => setBlockedRelationshipState(user, counterparty.address, status),
        () => removeBlocked(user, counterparty.address),
      );
    },
    [addBlocked, getBlocked, removeBlocked, setBlockedRelationshipState, updateCachedData],
  );
};

export default useUpdateBlockedRelationshipCache;
