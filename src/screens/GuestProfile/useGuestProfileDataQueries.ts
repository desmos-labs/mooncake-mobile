import useNumRelationships from '@recoil/numRelationshipState';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';
import {useEffect} from 'react';

const useGuestProfileDataQueries = (guestAddress: string) => {
  const {
    visitingProfileData,
    visitingProfileLoading,
    refetchVisitingProfileData,
  } = useProfileDataGivenAddress(guestAddress || '');

  /**
   * Refetch profile data if address changes
   */
  useEffect(() => {
    console.log('refetching guest profile data');
    refetchVisitingProfileData();
  }, []);

  const {address, bio, dtag, cover_pic, profile_pic, nickname} =
    visitingProfileData;

  const profileLoading = visitingProfileLoading;

  const {
    numRelationships,
    refreshNumRelationships,
    loading: numRelationshipsLoading,
  } = useNumRelationships(address);

  return {
    profileLoading,
    refetchVisitingProfileData,
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

export default useGuestProfileDataQueries;
