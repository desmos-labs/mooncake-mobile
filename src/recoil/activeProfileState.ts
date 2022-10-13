import messaging from '@react-native-firebase/messaging';
import React from 'react';
import {atom, DefaultValue, useRecoilState} from 'recoil';
import {useQuery} from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';

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
