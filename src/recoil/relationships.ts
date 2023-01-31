import React from 'react';
import {DataStatus, FollowedUser} from 'types/desmos';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';

const followageState = atom<Record<string, FollowedUser[]>>({
  key: 'followageState',
  default: getMMKV(MMKVKEYS.FOLLOWAGE) || {},
  effects: [
    ({onSet}) => {
      onSet(followage => {
        setMMKV(MMKVKEYS.FOLLOWAGE, followage);
      });
    },
  ],
});

/**
 * Hook that allows to easily know if a user is following another user having a given address.
 */
export const useHasFollowedUser = () => {
  const followage = useRecoilValue(followageState);
  return React.useCallback(
    (user: string, address: string) => {
      const userFollowage = followage[user] ?? [];
      const followedUser = userFollowage.find(
        f => f.address === address && f.status !== DataStatus.DELETED_LOCALLY,
      );
      return followedUser !== undefined;
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
 */
export const useGetFollowageDifference = () => {
  const followage = useRecoilValue(followageState);
  return React.useCallback(
    (user: string) => {
      const userFollowage = followage[user] ?? [];
      return userFollowage
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
 * Hook that allows to set the local status of a followed user.
 */
export const useSetFollowedUserStatus = () => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (user: string, counterparty: string, status: DataStatus) => {
      setFollowage(currentFollowage => {
        // Update the status of existing followed user
        const existingFollowage = currentFollowage[user] ?? [];
        const updateFollowage = existingFollowage.map(followedUser =>
          followedUser.address === counterparty
            ? ({
                address: followedUser.address,
                status,
              } as FollowedUser)
            : followedUser,
        );

        // Store the new values
        const newFollowage: Record<string, FollowedUser[]> = {
          ...currentFollowage,
        };
        newFollowage[user] = updateFollowage;
        return newFollowage;
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to add a new followed user on behalf of the user having the provided address.
 */
export const useAddFollowedUser = () => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (user: string, address: string) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage[user] ?? [];
        existingFollowage.push({
          address,
          status: DataStatus.CREATED_LOCALLY,
        } as FollowedUser);

        const newFollowage: Record<string, FollowedUser[]> = {
          ...currentFollowage,
        };
        newFollowage[user] = existingFollowage;
        return newFollowage;
      });
    },
    [setFollowage],
  );
};

/**
 * Hook that allows to remove a followed user on behalf of the user with the provided address.
 */
export const useRemoveFollowedUser = () => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (user: string, address: string) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage[user] ?? [];
        const filteredFollowage = existingFollowage.filter(
          f => f.address !== address,
        );

        const newFollowage: Record<string, FollowedUser[]> = {
          ...currentFollowage,
        };
        newFollowage[user] = filteredFollowage;
        return newFollowage;
      });
    },
    [setFollowage],
  );
};
