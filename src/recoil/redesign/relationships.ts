import React from 'react';
import {FollowedUser} from 'types/desmos';
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
      const followedUser = userFollowage.find(f => f.address === address);
      return followedUser !== undefined;
    },
    [followage],
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
