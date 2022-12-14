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
    fetchPolicy: 'no-cache',
  });

  const loadAddrsIntoState = React.useCallback(async () => {
    const _accounts = await getAccounts();

    if (_accounts.length > 0) {
      setStoredAccountAddrs(_accounts.map(x => x.address));
    }
  }, []);

  React.useEffect(() => {
    loadAddrsIntoState();
  }, []);

  // If data is not yet available, load accounts data from MMKV,
  // update the value in MMKV and atom once the data is ready
  React.useEffect(() => {
    // use cached values if data cannot be loaded
    if (!data) {
      const mmkvProfiles = getMMKV<ProfileData[]>(MMKVKEYS.PROFILES);

      setProfiles(mmkvProfiles || []);

      return;
    }

    // returned profile object will be an array
    const {profile} = data;
    setProfiles(profile);
  }, [data]);

  return {
    profiles,
    loadAddrsIntoState,
    loading,
  };
};

export default profilesState;
