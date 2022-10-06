import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {profileParamsState} from '@recoil/profileParams';
import useImageFromDevice from 'hooks/useImageFromDevice';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useMemo, useRef, useState} from 'react';
import {ScrollView, TextInput} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import signUpInfoState, {
  signUpBioState,
  signUpCoverPicState,
  signUpNicknameState,
  signUpProfilePicState,
} from '@recoil/signUpInfoState';
import createLocalWalletState from '@recoil/createLocalWalletState';
import createLedgerAccountState from '@recoil/createLedgerAccountState';
import useValidationSchema from './useValidationSchema';

function useHooks() {
  const signUpInfo = useRecoilValue(signUpInfoState);
  const setCoverPic = useSetRecoilState(signUpCoverPicState);
  const setProfilePic = useSetRecoilState(signUpProfilePicState);
  const setBio = useSetRecoilState(signUpBioState);
  const setNickname = useSetRecoilState(signUpNicknameState);

  const navigation =
    useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  const fromSignUp = useMemo(() => {
    const {routes} = navigation.getState();

    return routes[routes.length - 2].name === ROUTES.SIGNUP;
  }, [navigation]);

  const {imageAsset: coverPicture, imageFromLibrary: selectCoverPicture} =
    useImageFromDevice({
      onImageSelected: image => setCoverPic(image),
    });

  const {imageAsset: profilePicture, imageFromLibrary: selectProfilePicture} =
    useImageFromDevice({
      onImageSelected: image => setProfilePic(image),
    });

  const [loading, setLoading] = useState(false);

  const profileParams = useRecoilValue(profileParamsState);
  const nicknameInputRef = useRef<TextInput>(null);
  const dTagInputRef = useRef<TextInput>(null);
  const bioInputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const dtagMinLength = 6; // override the value (3) from query, 6 for App
  const nicknameMaxLength = 30; // override the value (1000) from query, 30 for App

  const validationSchema = useValidationSchema(
    fromSignUp,
    profileParams,
    nicknameMaxLength,
    dtagMinLength,
  );

  const initialFormState = useMemo(() => {
    if (fromSignUp) {
      return {
        nickname: signUpInfo.nickname,
        dTag: '',
        bio: signUpInfo.bio,
      };
    }

    return {
      nickname: '',
      dTag: '',
      bio: '',
    };
  }, [fromSignUp, signUpInfo]);

  const accountCreation = useRecoilValue(createLocalWalletState);
  const createLedgerAccount = useRecoilValue(createLedgerAccountState);

  return {
    signUpInfo,
    setNickname,
    setBio,
    fromSignUp,
    coverPicture,
    selectCoverPicture,
    profilePicture,
    selectProfilePicture,
    loading,
    setLoading,
    profileParams,
    nicknameInputRef,
    dTagInputRef,
    bioInputRef,
    scrollViewRef,
    nicknameMaxLength,
    validationSchema,
    initialFormState,
    accountCreation,
    createLedgerAccount,
  };
}

export default useHooks;
