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
import {useLazyQuery} from '@apollo/client';
import GetProfileSummaryForAddresses from 'services/graphql/queries/GetProfileSummaryForAddresses';
import useStyles from './useStyles';
import {DETOX_MOCK_ACCOUNT} from '../../../e2e/__mocks__/E2EVariableMocks';

// Mocked wallet data which will be passed into the SelectDTag screen.
const mockWalletData = [
  {
    chainAccount: {
      address: 'desmos1qp3733x370mtx6e4ppfgn96u6049kk89krv7q9',
      hdPath: [{}],
      pubKey: 'pubKey',
      signAlgorithm: 'secp256k1',
      type: 0,
    },
    wallet:
      '{"version":3,"privateKey":"privateKey","publicKey":"pubKey","prefix":"desmos"}',
  },
];

/**
 * Mock hooks for the PasswordManipulation screen
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

  const [getProfileSummaryForAddresses] = useLazyQuery(
    GetProfileSummaryForAddresses,
  );

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
        setLoading(true);
        // perhaps move this into global config

        const {confirmPassword} = formValues;

        setCreateLocalWalletState({
          mnemonic,
          password: confirmPassword,
        });

        setSignUpPassword(confirmPassword);

        setLoading(false);
        const existingAccounts = await getProfileSummaryForAddresses({
          variables: {
            // replace the address variable with the line below if you encounter a
            // crash due to dotenv requiring the os package.
            // The hardcoded value should be the same as the addresses of DETOX_MOCK_ACCOUNT
            // address: ['desmos1qp3733x370mtx6e4ppfgn96u6049kk89krv7q9]
            addresses: [DETOX_MOCK_ACCOUNT.address],
          },
        });

        setCreateLocalWalletState({
          mnemonic,
          password: confirmPassword,
        });

        setSignUpPassword(confirmPassword);

        if (
          existingAccounts.data &&
          existingAccounts.data.profile.length === 0
        ) {
          setLoading(false);
          navigate(ROUTES.NO_DTAG_FOUND);
        } else {
          navigate(ROUTES.SELECT_DTAG, {
            accountsWithWalletData: mockWalletData as any[],
            password: confirmPassword,
          });
        }
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
