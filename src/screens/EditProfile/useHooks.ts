import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {profileParamsState} from '@recoil/profileParams';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import useActiveAccount from 'hooks/useActiveAccount';
import useImageFromDevice from 'hooks/useImageFromDevice';
import useUnlockWallet from 'hooks/useUnlockWallet';
import {GrantEnums} from 'lib/desmos/msgtypes';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useCallback, useMemo, useState} from 'react';
import {Asset} from 'react-native-image-picker';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilValue} from 'recoil';
import useEditProfile from 'services/axios/requests/CentralizedBroadcastTx/EditProfile/useEditProfile';
import ProfileData from 'types/graphqlTypes';
import useValidationSchema from './useValidationSchema';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.EDIT_PROFILE>;

const useHooks = () => {
  const profileParams = useRecoilValue(profileParamsState);
  const {profileData, chainAccount} = useActiveAccount();
  const [profilePic, setProfilePic] = useState<Asset>();
  const [coverPic, setCoverPic] = useState<Asset>();
  const [loading, setLoading] = useState(false);
  const unlockWallet = useUnlockWallet();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const {manageProfile} = useEditProfile();
  const toast = useToast();
  const validationSchema = useValidationSchema(profileParams);
  const {goBack} = useNavigation<NavProps['navigation']>();

  const initialFormState = useMemo(() => {
    return {
      nickname: profileData?.nickname || '',
      dTag: profileData?.dtag || '',
      bio: profileData?.bio || '',
    };
  }, [profileData]);

  const {
    imageAsset: coverPictureFromDevice,
    imageFromLibrary: selectCoverPicture,
  } = useImageFromDevice({
    onImageSelected: image => setCoverPic(image),
  });

  const {
    imageAsset: profilePictureFromDevice,
    imageFromLibrary: selectProfilePicture,
  } = useImageFromDevice({
    onImageSelected: image => setProfilePic(image),
  });

  const profilePictureUri = useMemo(() => {
    if (profilePictureFromDevice) {
      return profilePictureFromDevice.uri;
    } else {
      return profileData?.profile_pic || undefined;
    }
  }, [profilePictureFromDevice, profileData]);

  const coverPictureUri = useMemo(() => {
    if (coverPictureFromDevice) {
      return coverPictureFromDevice.uri;
    } else {
      return profileData?.cover_pic || undefined;
    }
  }, [coverPictureFromDevice, profileData]);

  const onEditProfile = useCallback(
    async (values: typeof initialFormState) => {
      try {
        setLoading(true);
        if (chainAccount) {
          const unlockResult = await unlockWallet({chainAccount});
          if (!unlockResult) {
            throw new Error(
              'Error unlocking wallet or user cancelled authentication',
            );
          }
          const grantsToRequest: GrantEnums[] = [GrantEnums.MsgSaveProfile];
          // check if user has grants first
          const {success} = await checkAndUpdateGrants({
            grantsToRequest,
            address: chainAccount.address,
            stayOnCurrentScreen: true,
          });
          if (success) {
            const newValues: Partial<ProfileData> = {
              dtag:
                values.dTag === profileData?.dtag
                  ? '[do-not-modify]'
                  : values.dTag,
              nickname:
                values.nickname === profileData?.nickname
                  ? '[do-not-modify]'
                  : values.nickname,
              bio:
                values.bio === profileData?.bio
                  ? '[do-not-modify]'
                  : values.bio,
              profile_pic: profilePic?.uri ? profilePic.uri : '[do-not-modify]',
              cover_pic: coverPic?.uri ? coverPic.uri : '[do-not-modify]',
            };
            await manageProfile({profileData: newValues});
          } else {
            toast.show('[PLACEHOLDER]Authorization is required.', {
              type: ToastConfig.ERROR_NO_RETRY,
            });
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    },
    [chainAccount],
  );

  return {
    loading,
    profileParams,
    onEditProfile,
    initialFormState,
    validationSchema,
    profilePictureUri,
    coverPictureUri,
    selectProfilePicture,
    selectCoverPicture,
    goBack,
  };
};

export default useHooks;
