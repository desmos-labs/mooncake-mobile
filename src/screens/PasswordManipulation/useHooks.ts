import React from 'react';
import { passwordStrength } from 'check-password-strength';
import { NavProps, PASSWORD_MANIPULATION_MODE } from 'screens/PasswordManipulation';
import { useNavigation, useRoute } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import useStyles from './useStyles';

/**
 * Hooks for the PasswordManipulation screen
 */
const useHooks = () => {
  const styles = useStyles();
  const [loading, setLoading] = React.useState(false);

  const {
    params: { mode, account },
  } = useRoute<NavProps['route']>();

  const initialFormValues = React.useMemo(
    () => ({
      newPassword: '',
      confirmPassword: '',
    }),
    [],
  );

  const { navigate } = useNavigation<NavProps['navigation']>();

  const headerText = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD:
        return 'changePw';
      case PASSWORD_MANIPULATION_MODE.RESET_PASSWORD:
        return 'resetPw';
      case PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD:
        return 'setupPw';
      default:
        return '';
    }
  }, [mode]);

  const descriptionText = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD:
        return 'setupPwDescription';
      default:
        return '';
    }
  }, [mode]);

  const pwInputLabel = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD:
        return 'pw';
      default:
        return 'enterNewPw';
    }
  }, [mode]);

  const buttonLabel = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD:
        return 'common:next';
      default:
        return 'common:confirm';
    }
  }, [mode]);

  const handleFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      if (mode === PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD) {
      }
      if (mode === PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD && account) {
        navigate(ROUTES.SAVE_ACCOUNT, {
          password: formValues.newPassword,
          account: account.account,
          wallet: account.wallet,
        });
      }
    },
    [mode],
  );

  const mapPwStyle = React.useCallback((password: string) => {
    const { value } = passwordStrength(password);

    switch (value) {
      case 'Medium':
        return styles.mediumPw;
      case 'Strong':
        return styles.strongPw;
      default:
        return styles.weakPw;
    }
  }, []);

  return {
    loading,
    headerText,
    descriptionText,
    pwInputLabel,
    buttonLabel,
    handleFormSubmit,
    mapPwStyle,
    initialFormValues,
  };
};

export default useHooks;
