import React from 'react';
import {FollowedUser} from 'types/desmos';
import {atom, useRecoilValue, useSetRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {useActiveAddress} from '@recoil/redesign/wallets';

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
const useHasFollowedUser = () => {
  const followage = useRecoilValue(followageState);
  return React.useCallback(
    (user: string, address: string) => {
      const userFollowage = followage[user] ?? [];
      const followedUser = userFollowage.find(f => f.address === address);
      return followedUser !== undefined;
    },
    [followage],
  );
};

/**
 * Hook that allows to add a new followed user on behalf of the user having the provided address.
 */
const useAddFollowedUser = () => {
  const setFollowage = useSetRecoilState(followageState);
  return React.useCallback(
    (user: string, address: string) => {
      setFollowage(currentFollowage => {
        // Add the new followed user
        const existingFollowage = currentFollowage[user] ?? [];
        existingFollowage.push({
          address,
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
const useRemoveFollowedUser = () => {
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

/**
 * Hook that allows to know whether the current application user is following another user or not.
 */
export const useIsFollowing = () => {
  const activeAddress = useActiveAddress();
  const isFollowing = useHasFollowedUser();

  return React.useCallback(
    (address: string) => {
      return activeAddress && isFollowing(activeAddress, address);
    },
    [activeAddress, isFollowing],
  );
};

/**
 * Hook that allows to follow or unfollow a user on behalf of the current application user,
 * based on whether the user is already followed or not.
 */
export const useFollowOrUnfollowUser = () => {
  const activeAddress = useActiveAddress();

  const isFollowing = useHasFollowedUser();
  const followUser = useAddFollowedUser();
  const unfollowUser = useRemoveFollowedUser();

  return React.useCallback(
    (address: string) => {
      if (!activeAddress) {
        return;
      }

      // Follow or unfollow the user based on whether they are already followed or not
      switch (isFollowing(activeAddress, address)) {
        case false:
          followUser(activeAddress, address);
          break;
        case true:
          unfollowUser(activeAddress, address);
          break;
      }
    },
    [activeAddress, isFollowing, followUser, unfollowUser],
  );
};
