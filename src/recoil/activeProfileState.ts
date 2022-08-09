import React from 'react';
import {atom, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

/**
 * Recoil atom for profiles
 */
const activeProfileState = atom<ProfileData | undefined>({
  key: 'activeProfile',
  default: undefined,
});

export default activeProfileState;

export const useGetProfileData = (address: string) => {
  const {data} = useQuery(GetProfileForAddress, {variables: {address}});

  const [activeProfile, setActiveProfile] = useRecoilState(activeProfileState);

  React.useEffect(() => {
    if (!data) return;
    const {profile} = data;
    const [firstProfile] = profile;

    setActiveProfile(firstProfile);
  }, [data]);

  return {
    profileData: activeProfile,
  };
};
