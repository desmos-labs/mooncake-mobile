import React, {useState} from 'react';
import ROUTES from 'navigation/routes';
import {passwordStrength} from 'check-password-strength';
import {
  NavProps,
  PASSWORD_MANIPULATION_MODE,
} from 'screens/PasswordManipulation';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useSetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import useChangePassword from 'hooks/useChangePassword';
import signUpPasswordState from '@recoil/signUpPasswordState';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from './useStyles';

const mockAccountsOnChain: any[] = [
  {
    wallet:
      '{"version":3,"privateKey":"a_private_key","publicKey":"a_public_key","prefix":"desmos"}',
    chainAccount: {
      address: 'desmos123',
      type: 0,
      pubKey: 'a_pub_key',
      hdPath: {coinType: 852, change: 0, account: 0, addressIndex: 0},
      signAlgorithm: 'secp256k1',
    },
  },
];

/**
 * Mock Hooks for the PasswordManipulation screen
 * The contents of this file should be considered temporary, as the logic refactor
 * will likely affect how this flow works.
 */
const useHooks = () => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation('passwordManipulation');
  const setCreateLocalWalletState = useSetRecoilState(createLocalWalletState);
  const setSignUpPassword = useSetRecoilState(signUpPasswordState);

  const {changePassword} = useChangePassword();
  const toast = useToast();

  const {
    params: {mode, mnemonic, oldPassword},
  } = useRoute<NavProps['route']>();

  const {reset} = useNavigation<NavProps['navigation']>();

  const initialFormValues = React.useMemo(
    () => ({
      newPassword: '',
      confirmPassword: '',
    }),
    [],
  );

  const {navigate} = useNavigation<NavProps['navigation']>();

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
        try {
          setLoading(true);

          await changePassword({
            oldPassword: oldPassword as string,
            newPassword: formValues.newPassword,
          });

          navigate(ROUTES.CONFIRM_MODAL, {
            title: t('resultModal:success'),
            subtitle: t('resultModal:passwordWasChanged'),
            primaryButtonLabel: t('resultModal:goToProfile') as string,
            onPressPrimary: () => {
              reset({
                index: 1,
                routes: [
                  {
                    name: ROUTES.BOTTOM_TABS,
                    state: {
                      routes: [
                        {
                          name: ROUTES.USER_PROFILE,
                        },
                      ],
                    },
                  },
                ],
              });
            },
          });
        } catch (err) {
          toast.show(String(err), {
            type: ToastConfig.ERROR_NO_RETRY,
          });
        } finally {
          setLoading(false);
        }
      }
      if (mode === PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD && mnemonic) {
        // MOCK: navigate directly to select dtag screen with mocked data
        setLoading(true);

        const {confirmPassword} = formValues;

        setCreateLocalWalletState({
          mnemonic,
          password: confirmPassword,
        });

        setSignUpPassword(confirmPassword);

        setLoading(false);
        navigate(ROUTES.SELECT_DTAG, {
          accountsWithWalletData: mockAccountsOnChain,
          password: confirmPassword,
        });
      }
    },
    [mode],
  );

  const mapPwStyle = React.useCallback((password: string) => {
    const {value} = passwordStrength(password);

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
