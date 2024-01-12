import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useActiveAccountAddress } from '@recoil/accounts';
import { accountCreatedBg, accountCreatedIcon } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useTrackUser from 'hooks/analytics/useTrackUser';
import useRequestNotificationsPermission from 'hooks/notifications/useRequestNotificationsPermission';
import { Box, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
    <DView style={styles.root} backgroundImage={accountCreatedBg} backgroundFillScreen={true}>
      <Box flex={1} style={styles.container}>
        <Image contentFit="cover" source={accountCreatedIcon} style={styles.image} />
        <Spacer paddingTop={100} />
        <Box alignItems="center">
          <Typography.H4>{t('welcomeTitle')}</Typography.H4>
          <Spacer paddingTop={theme.spacing.s} />
          <Typography.Body6 style={CommonStyles.textAlign.center}>
            {t('welcomeSubtitle')}
          </Typography.Body6>
        </Box>
        <Spacer paddingTop={60} />
        <Button
          size={44}
          width={220}
          backgroundColor={theme.colors.surfaceBlack}
          textColor={theme.colors.white}
          style={styles.button}
          onPress={resetToHome}>
          {t('enter butter')}
        </Button>
        <Spacer paddingTop={theme.spacing.m} />
      </Box>
    </DView>
  );
};

export default WelcomePage;
