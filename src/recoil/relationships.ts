import React from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { mmkvValueToCache } from '@recoil/utils';
import {
  areFollowedUsersComparable,
  ComparableFollowedUser,
  FollowedUser,
} from 'types/relationships';
import { DesmosProfile } from 'types/desmos';

const relationshipsState = atom<MultipleUsersCache<FollowedUser, ComparableFollowedUser>>({
  key: 'relationshipsState',
  default: mmkvValueToCache(MMKVKEYS.FOLLOWAGE, areFollowedUsersComparable),
  effects: [
    ({ onSet }) => {
      onSet(followage => {
        setMMKV(MMKVKEYS.FOLLOWAGE, followage.serialize());
      });
    },
  ],
});

/**
 * Hook that allows to easily know if a user is following another user having a given address.
 */
export const useHasFollowedUser = () => {
  const followage = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userFollowage = followage.get(user);
      return userFollowage.has({ address: counterparty });
    },
    [followage],
  );
};

/**
 * Hook that allows to get the cached reaction for a given post.
 */
export const useGetRelationship = () => {
  const relationships = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userRelationships = relationships.get(user);
      return userRelationships.get({ address: counterparty });
    },
    [relationships],
  );
};

/**
 * Hook that allows to add a new relationship on behalf of the user having a provided address.
 */
export const useAddRelationship = () => {
  const setRelationships = useSetRecoilState(relationshipsState);

  return React.useCallback(
    (user: string, counterparty: DesmosProfile) => {
      setRelationships(currentRelationships => {
        const existingRelationships = currentRelationships.get(user);
        const existingRelationship = existingRelationships.get({
          address: counterparty.address,
        });
        switch (existingRelationship?.status) {
          case undefined:
            // The relationship does not exist in the cache, so add it
            return currentRelationships.update(
              user,
              existingRelationships.add({
                user: counterparty,
              }),
            );

          case DataStatus.DELETED_LOCALLY:
            // The reaction was deleted locally. Bring it back to CREATED
            return currentRelationships.update(
              user,
              existingRelationships.updateStatus(
                { address: counterparty.address },
                DataStatus.CREATED_LOCALLY,
              ),
            );

          default:
            // Do nothing in other cases
            return currentRelationships;
        }
      });
    },
    [setRelationships],
  );
};

/**
 * Hook that allows to set the local status of a relationship.
 */
export const useUpdateRelationshipStatus = () => {
  const setRelationships = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string, status: DataStatus) => {
      setRelationships(currentRelationships => {
        // Update the status of existing relationship
        const existingRelationships = currentRelationships.get(user);
        const updatedRelationships = existingRelationships.updateStatus(
          { address: counterparty },
          status,
        );
        return currentRelationships.update(user, updatedRelationships);
      });
    },
    [setRelationships],
  );
};

/**
 * Hook that allows to get the list of all the users that the given user is following and are stored locally.
 */
export const useGetFollowersToSync = () => {
  const relationships = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string) => {
      return relationships
        .readAll()
        .filter(r => r.user.address === user && r.status === DataStatus.CREATED_LOCALLY);
    },
    [relationships],
  );
};

/**
 * Hook that allows to get a number representing the current difference of the user followers.
 * The difference is computed by considering:
 * • each locally deleted relationship as <code>-1</code>
 * • each locally added relationship as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted relationships
 * • a difference of +1 means that overall there is 1 locally created relationship
 *
 * This difference can be used to show an updated followers count compared to the current values on the server.
 */
export const useGetFollowersDifference = () => {
  const followage = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string) => {
      const userFollowage = followage.readAll();
      return userFollowage
        .filter(followedUser => followedUser.user.address === user)
        .map(followedUser => {
          switch (followedUser.status) {
            case DataStatus.CREATED_LOCALLY:
              return 1;
            case DataStatus.DELETED_LOCALLY:
              return -1;
            default:
              return 0;
          }
        })
        .reduce((sum: number, value: number) => sum + value, 0);
    },
    [followage],
  );
};

/**
 * Hook that allows to get the list of followage that should be synced with the server.
 */
export const useGetFollowageToSync = () => {
  const followage = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string) => {
      const userFollowage = followage.get(user);
      return userFollowage.readAll().filter(r => r.status === DataStatus.CREATED_LOCALLY);
    },
    [followage],
  );
};

/**
 * Hook that allows to get a number representing the current difference of the user followage.
 * The difference is computed by considering:
 * • each locally deleted relationship as <code>-1</code>
 * • each locally added relationship as <code>+1</code>
 *
 * Here are some difference values examples:
 * • a difference of -2 means that overall there are 2 locally deleted relationships
 * • a difference of +1 means that overall there is 1 locally created relationship
 *
 * This difference can be used to show an updated followage count compared to the current values on the server.
 *
 * @param user {string} - Address of the user for which to get the difference.
 */
export const useGetFollowageDifference = (user: string) => {
  const followage = useRecoilValue(relationshipsState);
  return React.useCallback(() => {
    const userFollowage = followage.get(user);
    return userFollowage
      .readAll()
      .map(followedUser => {
        switch (followedUser.status) {
          case DataStatus.CREATED_LOCALLY:
            return 1;
          case DataStatus.DELETED_LOCALLY:
            return -1;
          default:
            return 0;
        }
      })
      .reduce((sum: number, value: number) => sum + value, 0);
  }, [followage, user]);
};

/**
 * Hook that allows to get the relationship that was created locally for a given user, if any.
 */
export const useGetCreatedRelationshipToSync = () => {
  const relationships = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userRelationships = relationships.get(user);
      return userRelationships
        .filter({ address: counterparty })
        .find(reaction => reaction.status === DataStatus.CREATED_LOCALLY);
    },
    [relationships],
  );
};

/**
 * Hook that allows to get the relationships that were deleted locally, if any.
 */
export const useGetDeletedRelationshipToSync = () => {
  const relationships = useRecoilValue(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      const userRelationships = relationships.get(user);
      return userRelationships
        .filter({ address: counterparty })
        .find(reaction => reaction.status === DataStatus.DELETED_LOCALLY);
    },
    [relationships],
  );
};

/**
 * Hook that allows to set the local status of a followed user.
 */
export const useSetFollowedUserStatus = () => {
  const setFollowage = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string, status: DataStatus) => {
      setFollowage(currentFollowage => {
        // Update the status of existing followed user
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.updateStatus({ address: counterparty }, status);
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to add a new followed user on behalf of the user having the provided address.
 */
export const useAddFollowedUser = () => {
  const setFollowage = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: DesmosProfile) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage.get(user);
        const existingRelationship = existingFollowage.get({
          address: counterparty.address,
        });
        switch (existingRelationship?.status) {
          case undefined:
            // The relationship does not exist in the cache, so add it
            return currentFollowage.update(user, existingFollowage.add({ user: counterparty }));

          case DataStatus.DELETED_LOCALLY:
            // The relationship was deleted locally. Bring it back to CREATED
            return currentFollowage.update(
              user,
              existingFollowage.updateStatus(
                { address: counterparty.address },
                DataStatus.CREATED_LOCALLY,
              ),
            );

          default:
            // Do nothing in other cases
            return currentFollowage;
        }
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to update a stored pending followed user for a given post.
 */
export const useUpdatePendingFollowedUser = () => {
  const setFollowage = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string, update: FollowedUser) => {
      setFollowage(currentFollowage => {
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.updatePending({ address: counterparty }, update);
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to delete a stored pending followed user for a given user.
 */
export const useRemovePendingFollowedUser = () => {
  const setFollowage = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      setFollowage(currentFollowage => {
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.removePending({ address: counterparty });
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to remove a followed user on behalf of the user with the provided address.
 */
export const useRemoveFollowedUser = () => {
  const setFollowage = useSetRecoilState(relationshipsState);
  return React.useCallback(
    (user: string, counterparty: string) => {
      setFollowage(currentFollowage => {
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.remove({ address: counterparty });
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [setFollowage],
  );
};
