import React from 'react';
import ROUTES from 'navigation/routes';
import {passwordStrength} from 'check-password-strength';
import {
  NavProps,
  PASSWORD_MANIPULATION_MODE,
} from 'screens/PasswordManipulation/index';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import LocalWallet from 'lib/LocalWallet';
import {DesmosClient} from '@desmoslabs/desmjs';
import EnvConfig from 'config/EnvConfig';
import useStyles from './useStyles';

/**
 * Hooks for the PasswordManipulation screen
 */
const useHooks = () => {
  const styles = useStyles();

  const {t} = useTranslation('passwordManipulation');

  const {
    params: {mode, mnemonic},
  } = useRoute<NavProps['route']>();

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
        navigate(ROUTES.RESULT_MODAL, {
          title: t('resultModal:success'),
          subtitle: t('resultModal:passwordWasChanged'),
          primaryButtonLabel: t('resultModal:goToProfile'),
          onDismiss: () => {
            // finish implementation when change pw feature is added
          },
        });
      }
      if (mode === PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD && mnemonic) {
        const ACCOUNT_SEARCH_LIMIT = 10;
        const client = await DesmosClient.connect(EnvConfig.DESMOS_RPC);

        const {confirmPassword} = formValues;

        const accountsToSearch = new Array(ACCOUNT_SEARCH_LIMIT)
          .fill(0)
          .map(async (_, idx) => {
            const wallet = await LocalWallet.fromMnemonic(mnemonic, {
              hdPath: {
                coinType: 852,
                change: 0,
                account: 0,
                addressIndex: idx,
              },
            });

            return {
              wallet: wallet.serialize(),
              account: await client.getAccount(wallet.bech32Address),
            };
          });

        const results = await Promise.allSettled(accountsToSearch);

        const accountsWithWalletData = results
          .filter(x => x.status === 'fulfilled')
          .map((y: any) => ({
            address: y.value.account.address,
            wallet: y.value.wallet,
          }));

        if (accountsWithWalletData.length === 0) {
          navigate(ROUTES.NO_DTAG_FOUND);
        } else {
          navigate(ROUTES.SELECT_DTAG, {
            accountsWithWalletData,
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
