import {useLazyQuery, useQuery} from '@apollo/client';
import EnvConfig from 'config/EnvConfig';
import React from 'react';
import {atom, useRecoilState, useSetRecoilState} from 'recoil';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

/**
 * An atom to hold account data of the user's selected profile
 * This should not be confused with the profiles atom, which contains data
 * for ALL of the profiles stored on the user's device
 */
const activeProfileState = atom<ProfileData | undefined>({
  key: 'activeProfile',
  default: undefined,
});

export default activeProfileState;

export const usePollProfileData = (address: string) => {
  const setActiveProfile = useSetRecoilState(activeProfileState);

  const {data, loading, refetch} = useQuery(GetProfileForAddress, {
    variables: {address},
    pollInterval: EnvConfig.POLLING_INTERVAL,
    fetchPolicy: 'no-cache',
  });

  React.useEffect(() => {
    if (!data) return;
    const {profile} = data;
    const [firstProfile] = profile;

    setActiveProfile(firstProfile);
  }, [data]);

  return {
    loading,
    refetch,
  };
};

export const useGetProfileData = (address: string) => {
  const [, {loading, refetch}] = useLazyQuery(GetProfileForAddress, {
    variables: {address},
  });

  const [activeProfile, setActiveProfile] = useRecoilState(activeProfileState);

  const fetchActiveProfile = React.useCallback(async (_address: string) => {
    const getProfileResponse = await refetch({address: _address});

    const {data} = getProfileResponse;
    if (!data) return;

    const {profile} = data;
    const [firstProfile] = profile;

    setActiveProfile(firstProfile);
  }, []);

  React.useEffect(() => {
    if (!activeProfile && address) {
      console.log('fetching');
      fetchActiveProfile(address);
    }
  }, [activeProfile, address]);

  return {
    profileData: activeProfile,
    loading,
    refetch,
  };
};
