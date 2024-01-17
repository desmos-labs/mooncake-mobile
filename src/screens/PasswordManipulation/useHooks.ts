import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useSetLoginFlowState } from '@recoil/login';
import { useStoreProfile } from '@recoil/profiles';
import { ToastType } from 'config/toast/toastConfig';
import useStoreAccount from 'hooks/accounts/useStoreAccount';
import useUpdateAccount from 'hooks/accounts/useUpdateAccount';
import useTrackLoggedInUser from 'hooks/analytics/useTrackLoggedInUser';
import useTrackProfileCreated from 'hooks/analytics/useTrackProfileCreated';
import useTrackProfileSelected from 'hooks/analytics/useTrackProfileSelected';
import useCheckBiometrics from 'hooks/biometrics/useCheckBiometrics';
import useEnableBiometrics from 'hooks/biometrics/useEnableBiometrics';
import useNavigateToProfileEdit from 'hooks/navigation/useNavigateToProfileEdit';
import useToast from 'hooks/toasts/useToast';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { InteractionManager, Keyboard } from 'react-native';
import { NavProps } from 'screens/PasswordManipulation';
import { LoginFlowStep } from 'types/login';

/**
 * Password manipulation mode.
 */
export enum PASSWORD_MANIPULATION_MODE {
  /**
   * Change password mode - used to change the password of an existing account.
   */
  CHANGE_PASSWORD,
  /**
   * Reset password mode - used to reset the password of an existing account.
   */
  RESET_PASSWORD,
  /**
   * [NO TOKENS NO ACCOUNT] Create account mode - used to create a new account requesting some funds.
   */
  CREATE_ACCOUNT_AND_PROFILE,
  /**
   * [HAS TOKENS] Setup account mode - used to setup an existing account without saving the profile on chain.
   */
  SETUP_ACCOUNT,
  /**
   * [HAS TOKENS] Setup account and profile mode - used to setup an existing account and creating/saving the profile on chain.
   */
  SETUP_ACCOUNT_AND_CREATE_PROFILE,
}

enum SignInStatus {
  UNDEFINED = 'UNDEFINED',
  SAVING_WALLET = 'Saving wallet',
  CREATING_PROFILE = 'Creating profile',
  SAVING_PROFILE = 'Saving profile',
  ENABLING_BIOMETRICS = 'Enabling biometrics',
  DONE = 'Done!',
}

/**
 * Hooks for the PasswordManipulation screen
 */
const useHooks = () => {
  const { t } = useTranslation('password');
  const [, setSigninStatus] = React.useState<SignInStatus>(SignInStatus.UNDEFINED);
  const [loading, setLoading] = React.useState(false);
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { mode, account, profile } = params;
  const toast = useToast();
  const storeAccount = useStoreAccount();
  const updateAccount = useUpdateAccount();
  const storeProfile = useStoreProfile();
  const saveProfile = useNavigateToProfileEdit();
  const enableBiometrics = useEnableBiometrics();
  const setLoginFlowState = useSetLoginFlowState();
  const { checkBiometrics, biometricsAvailable } = useCheckBiometrics();
  const trackLoggedInUser = useTrackLoggedInUser();
  const trackProfileCreated = useTrackProfileCreated();
  const trackProfileSelected = useTrackProfileSelected();

  useFocusEffect(
    React.useCallback(() => {
      InteractionManager.runAfterInteractions(() => {
        checkBiometrics();
      });
    }, [checkBiometrics]),
  );

  const initialFormValues = React.useMemo(
    () => ({
      newPassword: '',
      confirmPassword: '',
    }),
    [],
  );

  const headerText = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD:
        return t('change password');
      case PASSWORD_MANIPULATION_MODE.RESET_PASSWORD:
        return t('reset password');
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT:
      case PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE:
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE:
        return t('setup password');
      default:
        return undefined;
    }
  }, [mode, t]);

  const descriptionText = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT:
      case PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE:
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE:
        return t('setup password description');
      default:
        return undefined;
    }
  }, [mode, t]);

  const pwInputLabel = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT:
      case PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE:
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE:
        return t('password');
      default:
        return t('enter new password');
    }
  }, [mode, t]);

  const buttonLabel = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT:
      case PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE:
      case PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE:
        return t('next', { ns: 'common' });
      default:
        return t('confirm', { ns: 'common' });
    }
  }, [mode, t]);

  /**
   * Handle form submit for the password manipulation form
   * @param formValues Form values
   */
  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      Keyboard.dismiss();
      setLoading(true);
      /**
       * If mode is setup password, we need to store the
       * account and profile but not create a profile since we already have one
       */
      if (mode === PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT && account && profile) {
        setSigninStatus(SignInStatus.SAVING_WALLET);
        const storeAccountResult = await storeAccount(account, formValues.newPassword);
        if (storeAccountResult.isOk()) {
          if (biometricsAvailable) {
            setSigninStatus(SignInStatus.ENABLING_BIOMETRICS);
            await enableBiometrics(formValues.newPassword, false, profile.address);
          }
          setSigninStatus(SignInStatus.SAVING_PROFILE);
          storeProfile(profile.address, profile);

          navigate(ROUTES.FOLLOW_CREATORS, {
            isOnboarding: true,
            onStartBroadcasting: () => {
              setLoginFlowState({
                step: LoginFlowStep.Completed,
              });
              trackLoggedInUser(account.account);
              trackProfileSelected();
              setSigninStatus(SignInStatus.DONE);
              navigate(ROUTES.WELCOME_PAGE, {
                action: 'import',
              });
            },
          });
        } else {
          setLoading(false);
        }
        setLoading(false);
      }

      /**
       * If mode is setup password and profile, we need to store the account and create a profile
       */
      if (mode === PASSWORD_MANIPULATION_MODE.SETUP_ACCOUNT_AND_CREATE_PROFILE && account) {
        setSigninStatus(SignInStatus.CREATING_PROFILE);
        setSigninStatus(SignInStatus.SAVING_WALLET);
        await storeAccount(account, formValues.newPassword);
        if (biometricsAvailable) {
          setSigninStatus(SignInStatus.ENABLING_BIOMETRICS);
          await enableBiometrics(formValues.newPassword, false, account.wallet.address);
        }
        setLoginFlowState({
          step: LoginFlowStep.AccountCreated,
        });
        saveProfile({
          accountWithWallet: account,
          onProfileSaved: async () => {
            navigate(ROUTES.FOLLOW_CREATORS, {
              isOnboarding: true,
              onStartBroadcasting: () => {
                setSigninStatus(SignInStatus.DONE);
                setLoginFlowState({
                  step: LoginFlowStep.Completed,
                });
                trackLoggedInUser(account.account);
                trackProfileCreated();
                navigate(ROUTES.WELCOME_PAGE, {
                  action: 'create',
                });
              },
            });
          },
        });
        setLoading(false);
      }

      /**
       * If mode is create account and profile, we need to:
       * 1. Login
       * 2. Request funds
       * 3. Store account
       */
      if (mode === PASSWORD_MANIPULATION_MODE.CREATE_ACCOUNT_AND_PROFILE && account) {
        const storeAccountResult = await storeAccount(account, formValues.newPassword);
        if (storeAccountResult.isOk()) {
          if (biometricsAvailable) {
            setSigninStatus(SignInStatus.ENABLING_BIOMETRICS);
            await enableBiometrics(formValues.newPassword, false, account.wallet.address);
          }
          trackLoggedInUser(account.account);
          setLoginFlowState({
            step: LoginFlowStep.WaitingFeeGrant,
          });
          navigate(ROUTES.FEE_GRANT_WAITING_SCREEN, {
            granted: false,
          });
        } else {
          console.warn(storeAccountResult.error);
        }
        setLoading(false);
      }
      if (mode === PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD) {
        setLoading(true);
        const result = await updateAccount(account!, formValues.newPassword);
        setLoading(false);
        if (result.isErr()) {
          console.error(result.error);
          toast({
            toastType: ToastType.error,
            title: 'Error',
            message: result.error.message,
          });
        } else {
          navigate(ROUTES.CONFIRM_MODAL, {
            title: t('success', { ns: 'common' }),
            subtitle: t('you changed your password'),
            primaryButtonLabel: t('go back'),
            onPressPrimary: () => navigate(ROUTES.SETTINGS),
          });
        }
      }
    },
    [
      account,
      biometricsAvailable,
      enableBiometrics,
      mode,
      navigate,
      profile,
      saveProfile,
      setLoginFlowState,
      storeAccount,
      storeProfile,
      t,
      toast,
      trackLoggedInUser,
      trackProfileCreated,
      trackProfileSelected,
      updateAccount,
    ],
  );

  return {
    loading,
    headerText,
    descriptionText,
    pwInputLabel,
    buttonLabel,
    handleFormSubmit,
    initialFormValues,
  };
};

export default useHooks;
