import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActiveAccountAddress } from '@recoil/accounts';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useTrackUser from 'hooks/analytics/useTrackUser';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useStyles from './useStyles';

export interface WelcomePageParams {
  action?: 'create' | 'import';
}

export type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.WELCOME_PAGE>;

/**
 * Welcome screen that is shown after the user has successfully created or imported an account.
 * @constructor
 */
const WelcomePage = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const {
    params: { action },
  } = useRoute<NavProps['route']>();
  const { t } = useTranslation('welcomePage');
  const styles = useStyles();
  const theme = useTheme();
  const trackUser = useTrackUser();
  const activeAddress = useActiveAccountAddress();

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

  const resetToHome = React.useCallback(async () => {
    if (activeAddress) {
      await trackUser(activeAddress);
    }

    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
        },
      ],
    });
  }, [activeAddress, navigation, trackUser]);

  const subtitle = React.useMemo(() => {
    switch (action) {
      case 'create':
        return t('profile created');
      case 'import':
        return t('profile imported');
    }
  }, [action, t]);

  return (
    <DView style={styles.root}>
      <View style={styles.innerContainer}>
        <Spacer paddingBottom={theme.spacing.m} />
        <Typography.H6>{t('congratulations')}</Typography.H6>
        <Spacer paddingBottom={theme.spacing.s} />
        <Typography.Body5>{subtitle}</Typography.Body5>
        <Spacer paddingBottom={theme.spacing.xl} />
        <Button height={44} type="solid" onPress={resetToHome}>
          {t('enter bondscape')}
        </Button>
      </View>
    </DView>
  );
};

export default WelcomePage;
