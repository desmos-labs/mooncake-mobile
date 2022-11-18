import messaging from '@react-native-firebase/messaging';
import React from 'react';
import {atom, DefaultValue, useRecoilState, useSetRecoilState} from 'recoil';
import {useLazyQuery, useQuery} from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import EnvConfig from 'config/EnvConfig';

function isProfileData(
  data: ProfileData | DefaultValue | undefined,
): data is ProfileData {
  if (!data) {
    return false;
  } else {
    return (data as ProfileData).address !== undefined;
  }
}

/**
 * An atom to hold account data of the user's selected profile
 * This should not be confused with the profiles atom, which contains data
 * for ALL of the profiles stored on the user's device
 */
const activeProfileState = atom<ProfileData | undefined>({
  key: 'activeProfile',
  default: undefined,
  effects: [
    ({onSet}) => {
      onSet((newValue, oldValue) => {
        if (isProfileData(oldValue)) {
          messaging().unsubscribeFromTopic(oldValue?.address);
        }
        if (newValue?.address) {
          messaging().subscribeToTopic(newValue?.address);
        }
      });
    },
  ],
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
