import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActiveAccountAddress } from '@recoil/accounts';
import { mooncakeAnimationOrange } from 'assets/animations';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import CommonStyles from 'config/theme/CommonStyles';
import useTrackUser from 'hooks/analytics/useTrackUser';
import useRequestNotificationsPermission from 'hooks/notifications/useRequestNotificationsPermission';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import useStyles from './useStyles';

export interface WelcomePageParams {
  action?: 'create' | 'import';
}

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.WELCOME_PAGE>;

/**
 * Welcome screen that is shown after the user has successfully created or imported an account.
 * @constructor
 */
const WelcomePage = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('common');
  const styles = useStyles();
  const theme = useTheme();
  const trackUser = useTrackUser();
  const activeAddress = useActiveAccountAddress();
  const requestNotificationsPermissions = useRequestNotificationsPermission();

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

    await requestNotificationsPermissions();

    navigation.reset({
      index: 0,
      routes: [
        {
          name: ROUTES.BOTTOM_TABS,
        },
      ],
    });
  }, [activeAddress, navigation, requestNotificationsPermissions, trackUser]);

  return (
    <DView style={styles.root}>
      <View style={styles.container}>
        <ThemedLottieView
          source={mooncakeAnimationOrange}
          style={styles.image}
          loop={true}
          autoPlay
        />
        <Spacer paddingTop={46} />
        <View style={CommonStyles.center}>
          <Typography.H6>{t('welcomeTitle')}</Typography.H6>
          <Spacer paddingTop={theme.spacings.s} />
          <Typography.Regular14 style={CommonStyles.textAlign.center}>
            {t('welcomeSubtitle')}
          </Typography.Regular14>
        </View>
        <Spacer paddingTop={60} />
        <Button height={44} style={styles.button} onPress={resetToHome}>
          {t('explore now')}
        </Button>
        <Spacer paddingTop={theme.spacings.m} />
      </View>
    </DView>
  );
};

export default WelcomePage;
