import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { accountCreatedBg, accountCreatedIcon } from 'assets/images';
import Button from 'components/CustomButton';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
import { Account } from 'types/account';
import { Wallet } from 'types/wallet';
import { useSetActiveAccountAddress } from '@recoil/accounts';
import usePerformLogin from 'hooks/apis/usePerformLogin';
import useSaveAccount from './hooks';
import useStyles from './useStyles';

export interface SaveAccountParams {
  /**
   * Account that should be stored.
   */
  account: Account;
  /**
   * Wallet associated to the account that should be stored.
   */
  wallet: Wallet;
  /**
   * Password that should be used in order to securely encrypt the wallet data.
   */
  password: string;
}

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT
>;

/**
 * Screen that allows the user to save an account inside the device local storage.
 * @constructor
 */
const SaveAccount = ({ navigation }: NavProps) => {
  const { reset } = useNavigation<NavProps['navigation']>();
  const {
    params: { account, wallet, password },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('signup');
  const styles = useStyles();
  const theme = useTheme();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string>();
  const { saveAccount } = useSaveAccount();
  const setActiveAccount = useSetActiveAccountAddress();
  const performLogin = usePerformLogin();

  // Hook to prevent the user to go back, just allow it in debug if we need
  // to go back.
  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (!__DEV__ && e.data.action.type !== 'RESET') {
          e.preventDefault();
        }
      }),
    [navigation],
  );

  React.useEffect(() => {
    (async () => {
      setSaving(true);
      setError(undefined);
      // Save the account.
      const saveAccountResult = await saveAccount({ account, wallet }, password);
      if (saveAccountResult.isOk()) {
        // Try to perform the login.
        const loginResult = await performLogin(wallet);
        if (loginResult.isOk()) {
          // Login success, set the current account as active.
          setActiveAccount(account.address);
        } else {
          setError(loginResult.error.message);
        }
      } else {
        setError(saveAccountResult.error.message);
      }
      setSaving(false);
    })();

    // Disable the lint warning on the next line as we want this effect to be
    // called only one time when the user sees the saving account screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetToHome = React.useCallback(async () => {
    reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
        },
      ],
    });
  }, [reset]);

  return (
    <DView style={styles.root} backgroundImage={accountCreatedBg} backgroundFillScreen={true}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FastImage resizeMode="cover" source={accountCreatedIcon} style={styles.image} />
        <Spacer paddingTop={60} />
        <View style={{ alignItems: 'center' }}>
          {saving ? (
            <Typography.H4>{t('saving account')}</Typography.H4>
          ) : error !== undefined ? (
            <>
              <Typography.H4>{t('error saving the account')}</Typography.H4>
              <Spacer paddingTop={theme.spacing.s} />
              <Typography.Body6>{error}</Typography.Body6>
            </>
          ) : (
            <>
              <Typography.H4>{t('congratulations')}</Typography.H4>
              <Spacer paddingTop={theme.spacing.s} />
              <Typography.Body6>{t('profile created')}</Typography.Body6>
            </>
          )}
        </View>
        <Spacer paddingTop={60} />
        {!saving && (
          <Button
            size={44}
            backgroundColor={theme.colors.surfaceBlack}
            textColor={theme.colors.white}
            onPress={resetToHome}>
            {t('welcome')}
          </Button>
        )}
        <Spacer paddingTop={theme.spacing.m} />
      </View>
    </DView>
  );
};

export default SaveAccount;
