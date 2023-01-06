import React, {useState} from 'react';
import ROUTES from 'navigation/routes';
import {passwordStrength} from 'check-password-strength';
import {
  NavProps,
  PASSWORD_MANIPULATION_MODE,
} from 'screens/PasswordManipulation';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import LocalWallet from 'lib/LocalWallet';
import {DesmosClient} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import {ChainAccount, ChainAccountType} from 'types/chains';
import {toBase64} from '@cosmjs/encoding';
import {useSetRecoilState} from 'recoil';
import createLocalWalletState from '@recoil/createLocalWalletState';
import {useLazyQuery} from '@apollo/client';
import GetProfileForAddresses from 'services/graphql/queries/GetProfileForAddresses';
import useChangePassword from 'hooks/useChangePassword';
import signUpPasswordState from '@recoil/signUpPasswordState';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from './useStyles';

/**
 * Hooks for the PasswordManipulation screen
 */
const useHooks = () => {
  const styles = useStyles();
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation('passwordManipulation');
  const setCreateLocalWalletState = useSetRecoilState(createLocalWalletState);
  const setSignUpPassword = useSetRecoilState(signUpPasswordState);

  const {changePassword} = useChangePassword();
  const [getProfileForAddresses] = useLazyQuery(GetProfileForAddresses);
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
                    name: ROUTES.HOME_TABS,
                  },
                  {
                    name: ROUTES.USER_PROFILE,
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
        const ACCOUNT_SEARCH_LIMIT = 2;
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const {confirmPassword} = formValues;

        const accountsToSearch = new Array(ACCOUNT_SEARCH_LIMIT)
          .fill(0)
          .map(async (_, idx) => {
            const wallet = await LocalWallet.fromMnemonic(mnemonic, {
              hdPath: {
                coinType: 852,
                change: 0,
                account: idx,
                addressIndex: 0,
              },
            });

            const chainAccount: ChainAccount = {
              address: wallet.bech32Address,
              type: ChainAccountType.Local,
              pubKey: toBase64(wallet.publicKey),
              hdPath: {
                coinType: 852,
                change: 0,
                account: idx,
                addressIndex: 0,
              },
              signAlgorithm: 'secp256k1',
            };

            return {
              wallet: wallet.serialize(),
              account: await client.getAccount(wallet.bech32Address),
              chainAccount,
            };
          });

        const results = await Promise.allSettled(accountsToSearch);

        const accountsOnChain = results
          .filter(x => x.status === 'fulfilled')
          .map((y: any) => ({
            wallet: y.value.wallet,
            chainAccount: y.value.chainAccount,
          }));

        const addressesOfAccounts = accountsOnChain.map(
          x => x.chainAccount.address,
        );

        const existingAccounts = await getProfileForAddresses({
          variables: {
            addresses: addressesOfAccounts,
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
          setLoading(false);
          navigate(ROUTES.SELECT_DTAG, {
            accountsWithWalletData: accountsOnChain,
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
