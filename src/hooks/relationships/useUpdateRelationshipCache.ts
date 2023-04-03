import React from 'react';
import {
  useAddRelationship,
  useGetRelationship,
  useRemoveFollowedUser,
  useUpdateRelationshipStatus,
} from '@recoil/relationships';
import useUpdateCachedData from 'hooks/useUpdateCachedData';
import { DesmosProfile } from 'types/desmos';
import { DataStatus } from 'types/cache';

/**
 * Hook that allows to update the cached data about the relationships that a user has.
 */
const useUpdateRelationshipCache = () => {
  const getRelationship = useGetRelationship();
  const addRelationship = useAddRelationship();
  const setRelationshipStatus = useUpdateRelationshipStatus();
  const removeRelationship = useRemoveFollowedUser();

  const updateCachedData = useUpdateCachedData();

  return React.useCallback(
    (user: string, counterparty: DesmosProfile, isFollowing: boolean) => {
      const cachedRelationship = getRelationship(user, counterparty.address);
      updateCachedData(
        cachedRelationship,
        isFollowing,
        () => addRelationship(user, counterparty),
        (status: DataStatus) => setRelationshipStatus(user, counterparty.address, status),
        () => removeRelationship(user, counterparty.address),
      );
    },
    [addRelationship, getRelationship, removeRelationship, setRelationshipStatus, updateCachedData],
  );
};

export default useUpdateRelationshipCache;
