import {usePollProfileData} from '@recoil/activeProfileState';
import useActiveAccount from 'hooks/useActiveAccount';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';
import {useMemo} from 'react';

const useProfileDataQueries = (visitingProfileAddress?: string) => {
  const {visitingProfileData, visitingProfileLoading} =
    useProfileDataGivenAddress(visitingProfileAddress || '');
  const {activeAddress, profileData} = useActiveAccount();
  const {loading} = usePollProfileData(activeAddress!);

  const screenMode = useMemo(() => {
    if (visitingProfileAddress) {
      return activeAddress !== visitingProfileAddress
        ? 'guestProfile'
        : 'myProfile';
    }

    return 'myProfile';
  }, [visitingProfileAddress, activeAddress]);

  const {address, bio, dtag, cover_pic, profile_pic, nickname} =
    screenMode === 'guestProfile'
      ? visitingProfileData
      : (profileData as ProfileData);

  const profileLoading =
    screenMode === 'myProfile' ? loading : visitingProfileLoading;

  return {
    profileLoading,
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
  };
};

export default useProfileDataQueries;
