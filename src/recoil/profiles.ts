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

export const useLoadProfiles = () => {
  const [storedAccountAddrs, setStoredAccountAddrs] = React.useState<string[]>(
    [],
  );

  const [profiles, setProfiles] = useRecoilState(profilesState);

  const {data, loading} = useQuery(GetProfileSummaryForAddresses, {
    variables: {addresses: storedAccountAddrs},
  });

  React.useEffect(() => {
    const loadAddrsIntoState = async () => {
      const _accounts = await getAccounts();

      if (_accounts) {
        setStoredAccountAddrs(_accounts.map(x => x.address));
      }
    };
    loadAddrsIntoState();
  }, []);

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
