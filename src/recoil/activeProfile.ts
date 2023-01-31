import React from 'react';
import {atom, useRecoilValue} from 'recoil';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import {useActiveAccountAddress} from '@recoil/activeAccount';
import {useStoreProfile} from '@recoil/profiles';
import {useQuery} from '@apollo/client';

/**
 * An atom to hold account data of the user's selected profile
 * This should not be confused with the profiles atom, which contains data
 * for ALL of the profiles stored on the user's device
 */
const activeProfileState = atom<ProfileData | undefined>({
  key: 'activeProfile',
  default: undefined,
});

const useActiveProfile = () => {
  const activeAddress = useActiveAccountAddress();
  const storeProfile = useStoreProfile();
  const activeProfile = useRecoilValue(activeProfileState);

  const {data, loading, refetch} = useQuery(GetProfileForAddress, {
    variables: {address: activeAddress},
  });

  React.useEffect(() => {
    if (!data || !activeAddress) {
      return;
    }

    const {profile} = data;
    const [firstProfile] = profile;
    storeProfile(activeAddress, firstProfile);
  }, [activeAddress, data, storeProfile]);

  return {
    profile: activeProfile,
    loading,
    refetch,
  };
};

export default useActiveProfile;
