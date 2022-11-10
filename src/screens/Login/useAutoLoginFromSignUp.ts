import React from 'react';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import signUpPasswordState from '@recoil/signUpPasswordState';
import useActiveAccount from 'hooks/useActiveAccount';
import useLogin from 'services/axios/requests/Login/useLogin';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import ROUTES from 'navigation/routes';
import {useNavigation} from '@react-navigation/native';
import {NavProps} from './index';

/**
 * A hook that will auto-login the user if they have entered a password during the signup/import account screen.
 */
const useAutoLoginFromSignUp = () => {
  const signUpPassword = useRecoilValue(signUpPasswordState);
  const resetSignUpPassword = useResetRecoilState(signUpPasswordState);
  const {activeAddress} = useActiveAccount();
  const {login} = useLogin();
  const toast = useToast();
  const {replace} = useNavigation<NavProps['navigation']>();

  React.useEffect(() => {
    if (!signUpPassword || !activeAddress) return;

    const autoLogin = async () => {
      const loginResponse = await login({
        activeAddress,
        password: signUpPassword,
      });

      if (loginResponse) {
        replace(ROUTES.HOME_TABS, {
          screen: ROUTES.HOME_DISCOVER,
          params: {
            type: 'discover',
          },
        });
      } else {
        throw new Error('Invalid login response from server.');
      }
    };

    try {
      autoLogin();
    } catch (err) {
      console.warn(String(err));
      toast.show(String(err), {type: ToastConfig.ERROR_NO_RETRY});
    }

    // reset password on unmount to avoid login screen loading from flickering
    return () => {
      resetSignUpPassword();
    };
  }, [signUpPassword, activeAddress]);

  // pass boolean to control whether to show loading overlay on main screen
  return {
    shouldAutoLogin: !!signUpPassword,
  };
};

export default useAutoLoginFromSignUp;
