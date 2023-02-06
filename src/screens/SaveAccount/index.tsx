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
import { useSaveAccount } from 'screens/SaveAccount/useHooks';
import useStyles from './useStyles';

export interface SaveAccountParams {
  account: Account;
  wallet: Wallet;
  password: string;
}

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SAVE_ACCOUNT>;

const SaveAccount = () => {
  const { reset } = useNavigation<NavProps['navigation']>();
  const {
    params: { account, wallet, password },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('signup');
  const styles = useStyles();
  const theme = useTheme();
  const { saveAccount, savingAccount } = useSaveAccount();

  React.useEffect(() => {
    (async () => {
      await saveAccount(
        {
          account,
          wallet,
        },
        password,
      );
    })();
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
    <DView style={styles.root} topBar={<TopBar />}>
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
