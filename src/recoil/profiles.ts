import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {getMMKV, MMKVKEYS, setMMKV} from 'lib/MMKVStorage';
import {getAccounts} from 'lib/SecureStorage';
import {useQuery} from '@apollo/client';
import GetProfileSummaryForAddresses from 'services/graphql/queries/GetProfileSummaryForAddresses';

/**
 * Recoil atom for profiles
 */
const profilesState = atom<ProfileData[]>({
  key: 'profilesState',
  default: [],
  effects: [
    ({onSet}) => {
      onSet(newProfiles => {
        setMMKV(MMKVKEYS.PROFILES, newProfiles);
      });
    },
  ],
});

/**
 * A hook that fetches the account data of every stored account on the device
 */
export const useLoadProfiles = () => {
  const [storedAccountAddrs, setStoredAccountAddrs] = React.useState<string[]>(
    [],
  );

  const [profiles, setProfiles] = useRecoilState(profilesState);

  const {data, loading} = useQuery(GetProfileSummaryForAddresses, {
    variables: {addresses: storedAccountAddrs},
  });

  // First, map an array of each address stored on the device
  React.useEffect(() => {
    const loadAddrsIntoState = async () => {
      const _accounts = await getAccounts();

      if (_accounts) {
        setStoredAccountAddrs(_accounts.map(x => x.address));
      }
    };
    loadAddrsIntoState();
  }, []);

  // If data is not yet available, load accounts data from MMKV,
  // update the value in MMKV and atom once the data is ready
  React.useEffect(() => {
    // use cached values if data cannot be loaded
    if (!data) {
      const mmkvProfiles = getMMKV(MMKVKEYS.PROFILES);

      setProfiles(mmkvProfiles || []);

      return;
    }

    // returned profile object will be an array
    const {profile} = data;

    setProfiles(profile);
  }, [data]);

  return {
    profiles,
    loading,
  };
};

export default profilesState;
