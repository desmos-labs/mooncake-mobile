import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { mmkvValueToCache } from '@recoil/utils';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import React from 'react';
import {
  areBlockedUsersComparable,
  BlockedUser,
  ComparableBlockedUser,
} from 'types/blockedRelationships';
import { DesmosProfile } from 'types/desmos';

const blockedRelationshipsState = atom<MultipleUsersCache<BlockedUser, ComparableBlockedUser>>({
  key: 'blockedRelationshipsState',
  default: mmkvValueToCache(MMKVKEYS.BLOCKED, areBlockedUsersComparable),
  effects: [
    ({ onSet }) => {
      onSet(blocked => {
        setMMKV(MMKVKEYS.BLOCKED, blocked.serialize());
      });
    },
  ],
});

/**
 * Hook that allows to easily know if a user is blocking another user having a given address.
 */
export const useHasBlockedUser = () => {
  const blocked = useRecoilValue(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userBlocked = blocked.get(user);
      return userBlocked.has({ address: counterparty });
    },
    [blocked],
  );
};

export const useGetBlocked = () => {
  const blocked = useRecoilValue(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userBlocked = blocked.get(user);
      return userBlocked.get({ address: counterparty });
    },
    [blocked],
  );
};

/**
 * Hook that allows to add a new relationship on behalf of the user having a provided address.
 */
export const useAddBlockedRelationship = () => {
  const setRelationships = useSetRecoilState(blockedRelationshipsState);

  return React.useCallback(
    (user: string, counterparty: DesmosProfile) => {
      setRelationships(currentBlockedRelationships => {
        const existingBlockedRelationships = currentBlockedRelationships.get(user);
        const existingBlockedRelationship = existingBlockedRelationships.get({
          address: counterparty.address,
        });
        switch (existingBlockedRelationship?.status) {
          case undefined:
            // The relationship does not exist in the cache, so add it
            return currentBlockedRelationships.update(
              user,
              existingBlockedRelationships.add({
                user: counterparty,
              }),
            );

          case DataStatus.DELETED_LOCALLY:
            // The reaction was deleted locally. Bring it back to CREATED
            return currentBlockedRelationships.update(
              user,
              existingBlockedRelationships.updateStatus(
                { address: counterparty.address },
                DataStatus.CREATED_LOCALLY,
              ),
            );

          default:
            // Do nothing in other cases
            return currentBlockedRelationships;
        }
      });
    },
    [setRelationships],
  );
};

/**
 * Hook that allows to set the local status of a relationship.
 */
export const useUpdateBlockedRelationshipStatus = () => {
  const setBlockedRelationships = useSetRecoilState(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: string, status: DataStatus) => {
      setBlockedRelationships(currentBlockedRelationships => {
        // Update the status of existing relationship
        const existingBlockedRelationships = currentBlockedRelationships.get(user);
        const updatedBlockedRelationships = existingBlockedRelationships.updateStatus(
          { address: counterparty },
          status,
        );
        return currentBlockedRelationships.update(user, updatedBlockedRelationships);
      });
    },
    [setBlockedRelationships],
  );
};

/**
 * Hook that allows to get the list of followage that should be synced with the server.
 */
export const useGetBlockedToSync = () => {
  const blocked = useRecoilValue(blockedRelationshipsState);
  return React.useCallback(
    (user: string) => {
      const userBlocked = blocked.get(user);
      return userBlocked.readAll().filter(r => r.status === DataStatus.CREATED_LOCALLY);
    },
    [blocked],
  );
};

export const useSetBlockedUserStatus = () => {
  const setBlocked = useSetRecoilState(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: string, status: DataStatus) => {
      setBlocked(currentBlockedRelationships => {
        // Update the status of existing followed user
        const currentBlocked = currentBlockedRelationships.get(user);
        const updatedBlocked = currentBlocked.updateStatus({ address: counterparty }, status);
        return currentBlockedRelationships.update(user, updatedBlocked);
      });
    },
    [setBlocked],
  );
};

export const useAddBlockedUser = () => {
  const setBlocked = useSetRecoilState(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: DesmosProfile) => {
      setBlocked(currentBlockedRelationships => {
        // Add the new followed user
        const existingBlockedRelationships = currentBlockedRelationships.get(user);
        const existingBlocked = existingBlockedRelationships.get({
          address: counterparty.address,
        });
        switch (existingBlocked?.status) {
          case undefined:
            // The relationship does not exist in the cache, so add it
            return currentBlockedRelationships.update(
              user,
              existingBlockedRelationships.add({ user: counterparty }),
            );

          case DataStatus.DELETED_LOCALLY:
            // The relationship was deleted locally. Bring it back to CREATED
            return currentBlockedRelationships.update(
              user,
              existingBlockedRelationships.updateStatus(
                { address: counterparty.address },
                DataStatus.CREATED_LOCALLY,
              ),
            );

          default:
            // Do nothing in other cases
            return currentBlockedRelationships;
        }
      });
    },
    [setBlocked],
  );
};

/**
 * Hook that allows to remove a followed user on behalf of the user with the provided address.
 */
export const useRemoveBlockedUser = () => {
  const setBlocked = useSetRecoilState(blockedRelationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      setBlocked(currentBlocked => {
        const existingBlocked = currentBlocked.get(user);
        const updatedBlocked = existingBlocked.remove({ address: counterparty });
        return currentBlocked.update(user, updatedBlocked);
      });
    },
    [setBlocked],
  );
};
