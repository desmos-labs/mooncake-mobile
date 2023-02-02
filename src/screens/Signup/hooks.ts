import {useLazyQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import GetProfileForDTag from 'services/graphql/queries/GetProfileForDTag';
import useProfileParams from 'hooks/useProfileParams';
import * as Yup from 'yup';
import useGenerateRandomAccount from 'hooks/useGenerateRandomAccount';
import {useAppStateValue} from '@recoil/appState';
import usePerformLogin from 'hooks/usePerformLogin';
import useAcceptInvite from 'hooks/useAcceptInvite';
import {err, ok, Result} from 'neverthrow';
import {AccountWithWallet} from 'types/account';
import useSaveProfile from 'hooks/useSaveProfile';
import {useSignUpState} from '@recoil/screens/signUpState';
import useSaveAccount from 'hooks/useSaveAccount';

interface FormValues {
  readonly newPassword: string;
  readonly inviteCode: string;
  readonly consent: boolean;
}

/**
 * Hook that exports the initial form values.
 */
export const useInitialFormValues = (): FormValues => {
  return {
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

/**
 * Enum that represents all the possible statuses of the signup process.
 */
export enum SignUpStatus {
  UNDEFINED,
  CREATING_WALLET,
  CREATING_ACCOUNT,
  ACCEPTING_INVITE,
  DONE,
}

export interface SignUpSuccess {
  account: AccountWithWallet;
}

/**
 * Hook that allows to perform the signup of the user. This means:
 * 1. generating a random mnemonic wallet
 * 2. performing the login inside the centralized APIs;
 * 3. accepting the invitation to get some initial tokens.
 */
const usePerformSignUp = () => {
  const [status, setStatus] = useState<SignUpStatus>(SignUpStatus.UNDEFINED);

  const generateRandomAccount = useGenerateRandomAccount();
  const appInviteCode = useAppStateValue('inviteCode');
  const performLogin = usePerformLogin();
  const acceptInvite = useAcceptInvite();
  const saveAccount = useSaveAccount();

  const performSignUp = React.useCallback(
    async (values: FormValues): Promise<Result<SignUpSuccess, Error>> => {
      try {
        // Get and check the invite code
        const inviteCode = appInviteCode ?? values.inviteCode;
        if (!inviteCode) {
          setStatus(SignUpStatus.DONE);
          return err(new Error('Your invite code is invalid'));
        }

        console.log('Creating account with invite code:', inviteCode);

        // Create a random wallet
        setStatus(SignUpStatus.CREATING_WALLET);
        const account = await generateRandomAccount();

        // Perform the login
        setStatus(SignUpStatus.CREATING_ACCOUNT);
        const token = await performLogin(account);
        if (!token) {
          setStatus(SignUpStatus.DONE);
          return err(new Error('Cannot get token from APIs'));
        }

        console.log('Login successful. Token:', token);

        // Accept the invitation
        setStatus(SignUpStatus.ACCEPTING_INVITE);
        const result = await acceptInvite(account.account.address, inviteCode);
        if (result.isErr()) {
          setStatus(SignUpStatus.DONE);
          return err(result.error);
        }

        // Save the account locally
        await saveAccount(account);

        // Return
        setStatus(SignUpStatus.DONE);
        return ok({account} as SignUpSuccess);
      } catch (e: any) {
        setStatus(SignUpStatus.DONE);
        return err(new Error(e.toString()));
      }
    },
    [],
  );

  return {
    performSignUp,
    status,
  };
};

/**
 * Given a {@link string} value, returns either the value (if not empty),
 * or <code>undefined</code> if it's empty.
 */
export const omitEmptyValue = (value: string): string | undefined => {
  return value.trim().length > 0 ? value : undefined;
};

/**
 * Hook that allows to submit the form and properly sign up the user.
 */
export const useSubmitForm = () => {
  const {performSignUp, status: signUpStatus} = usePerformSignUp();
  const {saveProfile, status: saveProfileStatus} = useSaveProfile();

  const signUpState = useSignUpState();

  // Handles the submission of the form by first signing up the user, and then saving their profile.
  const handleFormSubmit = async (values: FormValues) => {
    // Signup the user inside the APIs
    const signUpResult = await performSignUp(values);
    if (signUpResult.isErr()) {
      // TODO: Show the error here, maybe in a modal
    }

    // Navigate to the screen allowing to save the profile
  };

  return {
    handleFormSubmit,
    signUpStatus,
    saveProfileStatus,
  };
};
