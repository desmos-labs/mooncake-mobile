import {useLazyQuery} from '@apollo/client';
import React from 'react';
import {atom, useRecoilState} from 'recoil';
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

export const useGetProfileData = (address: string) => {
  const [, {loading, refetch}] = useLazyQuery(GetProfileForAddress, {
    variables: {address},
    fetchPolicy: 'no-cache',
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
      fetchActiveProfile(address);
    }
  }, [activeProfile, address]);

  return {
    profileData: activeProfile,
    loading,
    refetch,
  };
};
