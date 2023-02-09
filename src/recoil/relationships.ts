import React from 'react';
import { FollowedUser } from 'types/desmos';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { DataStatus, MultipleUsersCache } from 'types/cache';
import { mmkvValueToCache } from '@recoil/utils';

type ComparableFollowedUser = Pick<FollowedUser, 'address'>;

const areFollowedUsersEqual = (
  first: ComparableFollowedUser,
  second: ComparableFollowedUser,
): boolean => {
  return first.address === second.address;
};

const followageState = atom<MultipleUsersCache<FollowedUser, ComparableFollowedUser>>({
  key: 'followageState',
  default: mmkvValueToCache(MMKVKEYS.FOLLOWAGE, areFollowedUsersEqual),
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
export const useHasFollowedUser = (user: string) => {
  const followage = useRecoilValue(followageState);
  return React.useCallback(
    (counterparty: string) => {
      const userFollowage = followage.get(user);
      return userFollowage.has({ address: counterparty });
    },
    [followage, user],
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
  const followage = useRecoilValue(followageState);
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
 * Hook that allows to set the local status of a followed user.
 */
export const useSetFollowedUserStatus = (user: string) => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (counterparty: string, status: DataStatus) => {
      setFollowage(currentFollowage => {
        // Update the status of existing followed user
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.updateStatus({ address: counterparty }, status);
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [user, setFollowage],
  );
};

/**
 * Hook that allows to add a new followed user on behalf of the user having the provided address.
 */
export const useAddFollowedUser = (user: string) => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (counterparty: string) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage.get(user);
        const existingRelationship = existingFollowage.get({
          address: counterparty,
        });
        switch (existingRelationship?.status) {
          case undefined:
            // The relationship does not exist in the cache, so add it
            return currentFollowage.update(
              user,
              existingFollowage.add({ address: counterparty } as FollowedUser),
            );

          case DataStatus.DELETED_LOCALLY:
            // The relationship was deleted locally. Bring it back to CREATED
            return currentFollowage.update(
              user,
              existingFollowage.updateStatus({ address: counterparty }, DataStatus.CREATED_LOCALLY),
            );

          default:
            // Do nothing in other cases
            return currentFollowage;
        }
      });
    },
    [setFollowage, user],
  );
};

/**
 * Hook that allows to remove a followed user on behalf of the user with the provided address.
 */
export const useRemoveFollowedUser = (user: string) => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (counterparty: string) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage.get(user);
        const updatedFollowage = existingFollowage.remove({ address: counterparty });
        return currentFollowage.update(user, updatedFollowage);
      });
    },
    [setFollowage, user],
  );
};
