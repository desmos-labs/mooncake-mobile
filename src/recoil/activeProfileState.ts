import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
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
  const {data, loading} = useQuery(GetProfileForAddress, {
    variables: {address},
  });

  const [activeProfile, setActiveProfile] = useRecoilState(activeProfileState);

  React.useEffect(() => {
    if (!data) return;
    const {profile} = data;
    const [firstProfile] = profile;

    setActiveProfile(firstProfile);
  }, [data]);

  return {
    profileData: activeProfile,
    loading,
  };
};
