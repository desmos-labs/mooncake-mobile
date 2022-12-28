import {useGetProfileData} from '@recoil/activeProfileState';
import useNumRelationships from '@recoil/numRelationshipState';
import useActiveAccount from 'hooks/useActiveAccount';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';
import {useEffect, useMemo} from 'react';

const useProfileDataQueries = (visitingProfileAddress?: string) => {
  const {
    visitingProfileData,
    visitingProfileLoading,
    refetchVisitingProfileData,
  } = useProfileDataGivenAddress(visitingProfileAddress || '');
  const {activeAddress, profileData} = useActiveAccount();
  const {refetch: refetchProfileData, loading} = useGetProfileData(
    activeAddress!,
  );

  /**
   * Refetch profile data if activeAddress changes
   */
  useEffect(() => {
    console.log('refetching profile data');
    refetchProfileData();
  }, [activeAddress]);

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

  const {
    numRelationships,
    refreshNumRelationships,
    loading: numRelationshipsLoading,
  } = useNumRelationships(address);

  return {
    profileLoading,
    refetchProfileData,
    refetchVisitingProfileData,
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
    screenMode,
    numRelationships,
    refreshNumRelationships,
    numRelationshipsLoading,
  };
};

export default useProfileDataQueries;
