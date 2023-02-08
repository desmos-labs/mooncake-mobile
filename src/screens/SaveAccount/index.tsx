import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { modalSuccess } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { Account } from 'types/account';
import { Wallet } from 'types/wallet';
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

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SAVE_ACCOUNT>;

/**
 * Screen that allows the user to save an account inside the device local storage.
 * @constructor
 */
const SaveAccount = () => {
  const { reset } = useNavigation<NavProps['navigation']>();
  const {
    params: { account, wallet, password },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('signup');
  const styles = useStyles();
  const theme = useTheme();
  const { saveAccount, savingAccount } = useSaveAccount();

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
      await saveAccount({ account, wallet }, password);
    })();
    // Disable the lint warning on the next line as we want this effect to be
    // called only one time when the user sees the saving account screen
    // eslint-disable-next-line
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
    <DView style={styles.root} topBar={<TopBar noBackButton={true} />}>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <FastImage resizeMode="cover" source={modalSuccess} style={styles.image} />
        <Spacer paddingTop={60} />
        <View style={{ alignItems: 'center' }}>
          <Typography.H4>{t('congratulations')}</Typography.H4>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body6>{t('profile created')}</Typography.Body6>
        </View>
        <Spacer paddingTop={60} />
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={resetToHome}
          disabled={savingAccount}>
          <Typography.Button2 style={{ color: theme.colors.white }}>
            {t('welcome to butter')}
          </Typography.Button2>
        </Button>
        <Spacer paddingTop={theme.spacing.m} />
      </View>
    </DView>
  );
};

export default SaveAccount;
