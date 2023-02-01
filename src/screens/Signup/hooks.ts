import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert} from 'react-native';
import GetProfileForDTag from 'services/graphql/queries/GetProfileForDTag';
import useProfileParams from 'hooks/useProfileParams';
import * as Yup from 'yup';
import useGenerateRandomAccount from 'hooks/useGenerateRandomAccount';
import {useAppStateValue} from '@recoil/appState';
import usePerformLogin from 'hooks/usePerformLogin';
import useAcceptInvite from 'hooks/useAcceptInvite';

interface FormValues {
  readonly dTag: string;
  readonly newPassword: string;
  readonly inviteCode: string;
  readonly consent: boolean;
}

/**
 * Hook that exports the initial form values.
 */
export const useInitialFormValues = () => {
  return {
    dTag: '',
    newPassword: '',
    inviteCode: '',
    consent: false,
  } as FormValues;
};

/**
 * Hook that allows to check whether the given DTag is available or not.
 */
export const useCheckDTagAvailability = () => {
  const [getDTagAvailability] = useLazyQuery(GetProfileForDTag);
  return React.useCallback(
    async (inputDTag: string) => {
      const {data} = await getDTagAvailability({variables: {dTag: inputDTag}});
      return (data?.profile?.length ?? 0) === 0;
    },
    [getDTagAvailability()],
  );
};

/**
 * Hook that returns the validation schema to be used when validating the sign up form.
 */
export const useValidationSchema = () => {
  const {t} = useTranslation('passwordManipulation');
  const {params: profileParams} = useProfileParams();
  return React.useMemo(() => {
    return Yup.object().shape({
      inviteCode: Yup.string().required(t('error:required')),
      dTag: Yup.string()
        .required(t('error:required'))
        .min(
          profileParams.dTag.minLength,
          t('error:minChar', {
            numChar: profileParams.dTag.minLength,
          }),
        )
        .max(
          profileParams.dTag.maxLength,
          t('error:maxChar', {
            numChar: profileParams.dTag.maxLength,
          }),
        )
        .test(
          'respect reg_ex',
          t('Only _ is allowed as special character'),
          value => {
            return new RegExp(profileParams.dTag.regEx, 'g').test(
              value as string,
            );
          },
        ),
    });
  }, [profileParams]);
};

/**
 * Hook that should be used in order to validate the form.
 */
export const useValidateForm = () => {
  const {t} = useTranslation('passwordManipulation');
  return React.useCallback(
    (values: FormValues) => {
      const errors: any = {};

      if (!values.consent) {
        errors.consent = t('consent not checked');
      }

      return errors;
    },
    [t],
  );
};

/**
 * Hook that allows to handle the press on the privacy policy button.
 */
export const useHandlePressPrivacyPolicy = () => {
  return React.useCallback(() => {
    // go to Privacy policy page
  }, []);
};

/**
 * Hook that allows to handle the press on the Terms of Service button.
 */
export const useHandlePressTOS = () => {
  return React.useCallback(() => {
    // go to Terms of Service page
  }, []);
};

/**
 * Hook that allows to open the modal to tell the user what is a DTag and how is it used.
 */
export const useOpenInfoModal = () => {
  const {t} = useTranslation('passwordManipulation');
  const {navigate} = useNavigation<NavProps['navigation']>();

  return React.useCallback(() => {
    navigate(ROUTES.TEXTONLY_MODAL, {
      title: t('signup:profile dtag'),
      body: t('signup:dtag info'),
    });
  }, []);
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SIGNUP>;

export enum SignUpStatus {
  UNDEFINED,
  CREATING_WALLET,
  CREATING_ACCOUNT,
  ACCEPTING_INVITE,
  DONE,
}

/**
 * Hook that allows to create the profile of the user.
 */
const usePerformSignUp = () => {
  const [status, setStatus] = useState<SignUpStatus>(SignUpStatus.UNDEFINED);
  const [error, setError] = useState<string | undefined>();

  const generateRandomAccount = useGenerateRandomAccount();
  const appInviteCode = useAppStateValue('inviteCode');
  const performLogin = usePerformLogin();
  const acceptInvite = useAcceptInvite();

  const handleError = (e: string) => {
    setError(e);
    setStatus(SignUpStatus.DONE);
    Alert.alert('Error', e);
  };

  const performSignUp = React.useCallback(async (values: FormValues) => {
    try {
      // Get and check the invite code
      const inviteCode = appInviteCode ?? values.inviteCode;
      if (!inviteCode) {
        Alert.alert('Error', 'Your invite code is invalid');
        return;
      }

      console.log('Creating account with invite code:', inviteCode);

      // Create a random wallet
      setStatus(SignUpStatus.CREATING_WALLET);
      const account = await generateRandomAccount();

      // Perform the login
      setStatus(SignUpStatus.CREATING_ACCOUNT);
      const token = await performLogin(account);
      if (!token) {
        handleError('Cannot get token from APIs');
        return;
      }

      console.log('Performed login. Retrieved token:', token);

      // Accept the invitation
      await acceptInvite({
        invitee: account.account.address,
        inviteCode,
        onSuccess: () => {
          setStatus(SignUpStatus.DONE);
        },
        onTimeout: () => {
          handleError('Request timeout');
        },
        onError: (e: Error) => {
          handleError(e.message);
        },
      });
    } catch (e: any) {
      handleError(e.toString());
    }
  }, []);

  return {
    performSignUp,
    status,
    error,
  };
};

// TODO: Move this inside another hook
export enum SaveProfileStatus {
  UNKNOWN,
  UPLOADING_DATA,
  DONE,
}

// TODO: Implement this
const useSaveProfile = () => {
  const [status, setStatus] = useState<SaveProfileStatus>(
    SaveProfileStatus.UNKNOWN,
  );

  const saveProfile = React.useCallback(async () => {
    // const {wallet, address, password, dTag} = signupValues;
    // const {nickname, coverPicture, profilePicture, bio} = signUpInfo;
    //
    // const [uploadProfilePicResult, uploadCoverPicResult] = await Promise.all([
    //   profilePicture && UploadMedia({mediaFile: profilePicture}),
    //   coverPicture && UploadMedia({mediaFile: coverPicture}),
    // ]);
    //
    // const profilePictureUrl = _.get(uploadProfilePicResult, 'url');
    // const coverPictureUrl = _.get(uploadCoverPicResult, 'url');
    //
    // // Save new wallet as last selected wallet
    // // Build save profile message
    // const saveProfileMessage: MsgSaveProfileEncodeObject = {
    //   typeUrl: GenericMsgEnums.MsgSaveProfile,
    //   value: {
    //     creator: address,
    //     dtag: dTag,
    //     nickname: nickname || '[do-not-modify]',
    //     bio: bio || '[do-not-modify]',
    //     profilePicture: profilePictureUrl || '[do-not-modify]',
    //     coverPicture: coverPictureUrl || '[do-not-modify]',
    //   },
    // };
    // stopPolling();
    // const messages = [saveProfileMessage];
    // setLoading(false);
    // setSignUpPassword(password);
    //
    // navigate(ROUTES.BROADCAST_TX, {
    //   title: t('broadcastTx:signUp') as string,
    //   messages,
    //   offlineSigner: wallet,
    //   successAction: () => {
    //     push(ROUTES.SIGNUP_RESULT);
    //   },
    //   failureAction: () => {
    //     goBack();
    //   },
    // });
  }, []);

  return {
    saveProfile,
    status,
  };
};

export const useSubmitForm = () => {
  const {performSignUp, status: signUpStatus, error} = usePerformSignUp();
  const {saveProfile, status: saveProfileStatus} = useSaveProfile();

  // Handles the submission of the form by starting the signup.
  // Once the sign up is completed, the below effect will start the saving of the profile.
  const handleFormSubmit = async (values: FormValues) => {
    await performSignUp(values);
  };

  // Check the signup status and react to that by starting the
  // profile saving flow if it's successful.
  React.useEffect(() => {
    if (signUpStatus === SignUpStatus.DONE && !error) {
      saveProfile();
    }
  }, [signUpStatus, error]);

  return {
    handleFormSubmit,
    signUpStatus,
    saveProfileStatus,
  };
};
