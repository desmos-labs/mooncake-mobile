import {useGetProfileData} from '@recoil/activeProfileState';
import useNumRelationships from '@recoil/numRelationshipState';
import useActiveAccount from 'hooks/useActiveAccount';
import {useEffect} from 'react';

const useProfileDataQueries = () => {
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

  const {address, bio, dtag, cover_pic, profile_pic, nickname} =
    profileData as ProfileData;

  const profileLoading = loading;

  const {
    numRelationships,
    refreshNumRelationships,
    loading: numRelationshipsLoading,
  } = useNumRelationships(address);

  return {
    profileLoading,
    refetchProfileData,
    address,
    bio,
    dtag,
    cover_pic,
    profile_pic,
    nickname,
    numRelationships,
    refreshNumRelationships,
    numRelationshipsLoading,
  };
};

export default useProfileDataQueries;
