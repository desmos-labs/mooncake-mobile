import { MsgSaveProfileEncodeObject } from '@desmoslabs/desmjs';
import { MsgSaveProfile } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import { GrantEnums } from 'lib/DesmosUtils/msgtypes';
import { useCallback } from 'react';
import { encodeAndBroadcastTx } from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that wraps logic to allow the user to edit their profile.
 */
const useEditProfile = () => {
  /**
   * @param {ProfileData} profileData An object containing everything related to the Desmos Profile
   * */
  const editProfile = useCallback(
    async ({
      profileData,
      userAddress,
    }: {
      profileData: Partial<ProfileData>;
      userAddress: string;
    }) => {
      const msg: MsgSaveProfileEncodeObject = {
        typeUrl: GrantEnums.MsgSaveProfile,
        value: MsgSaveProfile.fromPartial({
          dtag: profileData.dtag,
          nickname: profileData.nickname,
          bio: profileData.bio,
          profilePicture: profileData.profile_pic,
          coverPicture: profileData.cover_pic,
          creator: userAddress,
        }),
      };

      const result = await encodeAndBroadcastTx({ msgs: [msg] });

      return result;
    },
    [],
  );

  return { editProfile };
};

export default useEditProfile;
