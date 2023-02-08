import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import useGenerateRandomAccount from 'hooks/useGenerateRandomAccount';
import { useAppStateValue } from '@recoil/appState';
import usePerformLogin from 'hooks/usePerformLogin';
import useAcceptInvite from 'hooks/useAcceptInvite';
import { err, ok, Result } from 'neverthrow';
import { AccountWithWallet } from 'types/account';
import useStoreAccount from 'hooks/useStoreAccount';
import { useSetActiveAccountAddress } from '@recoil/accounts';
import useSaveProfile from 'hooks/useSaveProfile';

interface FormValues {
  readonly newPassword: string;
  readonly inviteCode: string;
  readonly consent: boolean;
}

/**
 * Hook that exports the initial form values.
 */
export const useInitialFormValues = (): FormValues => {
  const inviteCode = useAppStateValue('inviteCode');
  return {
    newPassword: '',
    inviteCode,
    consent: false,
  } as FormValues;
};

/**
 * Hook that returns the validation schema to be used when validating the sign up form.
 */
export const useValidationSchema = () => {
  const { t } = useTranslation('passwordManipulation');
  return React.useMemo(() => {
    return Yup.object().shape({
      inviteCode: Yup.string().required(t('error:required')),
    });
  }, [t]);
};

/**
 * Hook that should be used in order to validate the form.
 */
export const useValidateForm = () => {
  const { t } = useTranslation('passwordManipulation');
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
  const storeAccount = useStoreAccount();
  const setActiveAccountAddress = useSetActiveAccountAddress();

  const performSignUp = React.useCallback(
    async (values: FormValues): Promise<Result<SignUpSuccess, Error>> => {
      // Get and check the invite code
      const inviteCode = appInviteCode ?? values.inviteCode;
      if (!inviteCode) {
        setStatus(SignUpStatus.DONE);
        return err(new Error('Your invite code is invalid'));
      }

      console.log('Creating account with invite code', inviteCode);

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
      const inviteResult = await acceptInvite(account.account.address, inviteCode);
      if (inviteResult.isErr()) {
        setStatus(SignUpStatus.DONE);
        return err(inviteResult.error);
      }

      // Save the account locally
      const result = await storeAccount(account, values.newPassword);
      if (result.isErr()) {
        return err(result.error);
      }

      // Set the account as active
      setActiveAccountAddress(account.account.address);

      // Return
      setStatus(SignUpStatus.DONE);
      return ok({ account } as SignUpSuccess);
    },
    [
      acceptInvite,
      appInviteCode,
      generateRandomAccount,
      performLogin,
      setActiveAccountAddress,
      storeAccount,
    ],
  );

  return {
    performSignUp,
    status,
  };
};

/**
 * Hook that allows to submit the form and properly sign up the user.
 * @param onSuccess - Function that is called when the profile has been saved successfully
 * @param onError - Function that is called if an error is raised.
 */
export const useSubmitForm = (onSuccess: () => void, onError: (error: Error) => void) => {
  const { performSignUp, status: signUpStatus } = usePerformSignUp();
  const saveProfile = useSaveProfile();

  // Handles the submission of the form by first signing up the user, and then saving their profile.
  const handleFormSubmit = React.useCallback(
    async (values: FormValues) => {
      // Signup the user inside the APIs
      const signUpResult = await performSignUp(values);
      if (signUpResult.isErr()) {
        console.log(signUpResult.error);
        onError(signUpResult.error);
        return;
      }

      // Navigate to the screen allowing to save the profile
      saveProfile({
        // We don't immediately store the profile on-chain as this will be done
        // before the first transaction is broadcast. This is made in order to
        // make sure that there is enough time to get the tokens from the APIs,
        // as well as to speed up the signup procedure.
        storeOnChain: false,

        // Use the account that was generated during the signup in order to
        // store the profile
        account: signUpResult.value.account,

        // Callbacks used to get back the result of the profile saving
        onSuccess,
        onError,
      });
    },
    [onError, onSuccess, performSignUp, saveProfile],
  );

  return {
    handleFormSubmit,
    signUpStatus,
  };
};
