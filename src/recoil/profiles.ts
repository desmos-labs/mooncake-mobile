import React from 'react';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {activeAccountAddressState} from '@recoil/wallets';
import {DesmosProfile} from 'types/desmos';

/**
 * Atom that holds the data of all the cached profiles.
 */
const profilesState = atom<Record<string, DesmosProfile>>({
  key: 'profilesState',
  default: getMMKV(MMKVKEYS.PROFILES) || {},
  effects: [
    ({onSet}) => {
      onSet(newProfiles => {
        setMMKV(MMKVKEYS.PROFILES, newProfiles);
      });
    },
  ],
});

/**
 * Hook that allows to get the profiles stored on the device.
 */
export const useStoredProfiles = () => useRecoilValue(profilesState);

/**
 * Hook that allows to easily store a new profile inside the profilesState Atom.
 */
export const useStoreProfile = () => {
  const [, setProfiles] = useRecoilState(profilesState);
  return React.useCallback(
    (address: string, profile: DesmosProfile | undefined) => {
      setProfiles(exitingProfiles => {
        const profiles: Record<string, DesmosProfile> = {
          ...exitingProfiles,
        };

        switch (profile) {
          case undefined:
            // If the given profile is undefined, delete the profile from the stored profiles map
            delete profiles[address];
            break;
          default:
            // If the profile is not undefined, store it inside the cache
            profiles[profile.address] = profile;
            break;
        }

        return profiles;
      });
    },
    [setProfiles],
  );
};

/**
 * Hook that allows to easily delete a cached profile.
 */
export const useDeleteProfile = () => {
  const setProfiles = useSetRecoilState(profilesState);
  return React.useCallback(
    (address: string) => {
      setProfiles(storedProfiles => {
        const newValue = {
          ...storedProfiles,
        };
        delete newValue[address];
        return newValue;
      });
    },
    [setProfiles],
  );
};

/**
 * An atom to hold profile data of the user's selected account.
 * This should not be confused with the profilesState atom, which contains data
 * for ALL the profiles stored on the user's device
 */
const activeProfileState = selector<DesmosProfile | undefined>({
  key: 'activeProfileState',
  get: ({get}) => {
    const profiles = get(profilesState);
    const selectedAccountAddress = get(activeAccountAddressState);
    return selectedAccountAddress && profiles
      ? profiles[selectedAccountAddress]
      : undefined;
  },
});

/**
 * Hook that allows to easily get the active profile value.
 */
export const useActiveProfile = () => useRecoilValue(activeProfileState);
