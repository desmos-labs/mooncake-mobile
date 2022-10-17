import {DesmosClient, MsgSaveProfileEncodeObject} from '@desmoslabs/desmjs';
import {MsgSaveProfile} from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_profile';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import {GrantEnums} from 'lib/desmos/msgtypes';
import React, {useCallback} from 'react';
import CentralizedBroadcastTx from 'services/axios/requests/CentralizedBroadcastTx';

/**
 * Hook that manange a profile
 */
const useEditProfile = () => {
  const {activeAddress} = useActiveAccount();
  const [editProfileLoading, setEditProfileLoading] = React.useState(false);

  const editProfile = React.useCallback(
    async ({profileData}: {profileData: Partial<ProfileData>}) => {
      if (!activeAddress) return;
      console.log(profileData);

      try {
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);
        const msg: MsgSaveProfileEncodeObject = {
          typeUrl: GrantEnums.MsgSaveProfile,
          value: MsgSaveProfile.fromPartial({
            dtag: profileData.dtag,
            nickname: profileData.nickname,
            bio: profileData.bio,
            profilePicture: profileData.profile_pic,
            coverPicture: profileData.cover_pic,
            creator: activeAddress,
          }),
        };

        const aminoEncodedMsg = client.encodeToAmino([msg]);

        return await CentralizedBroadcastTx({
          messages: aminoEncodedMsg,
        });
      } catch (err: any) {
        throw new Error(err.toString());
      }
    },
    [activeAddress],
  );

  /**
   * @param {ProfileData} profileData An object containing everything related to the Desmos Profile
   * */
  const manageProfile = useCallback(
    async ({profileData}: {profileData: Partial<ProfileData>}) => {
      setEditProfileLoading(true);
      let result;
      try {
        result = await editProfile({profileData});
      } catch (err: any) {
        throw new Error(err.toString());
      } finally {
        setEditProfileLoading(false);
        console.log(result);
      }
    },
    [editProfile],
  );

  return {manageProfile, editProfileLoading};
};

export default useEditProfile;
