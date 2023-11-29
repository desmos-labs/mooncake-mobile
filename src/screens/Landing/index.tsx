import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { appleLoginIcon, butterflyLandingIcon, googleLoginIcon, landingBG } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { Box, Text, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Platform, View } from 'react-native';
import { Web3AuthLoginProvider } from 'types/web3auth';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

/**
 * Screen that is shown to the user when they open the application for the first time.
 * From here, they can decide to create a new account, or import an existing one.
 * @constructor
 */

export interface LandingParams {
  invited?: boolean;
}

const Landing = () => {
  const theme = useTheme();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onSignUp = React.useCallback(
    (login: 'mnemonic' | Web3AuthLoginProvider) => {
      // Handle the post consent behavior with a reusable callback.
      navigate(ROUTES.SERVICE_AND_POLICY, {
        loginProvider: login,
      });
    },
    [navigate],
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView backgroundImage={landingBG} backgroundFillScreen style={styles.container}>
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('butter')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('header')}
      </Text>
      <Spacer paddingTop={theme.spacing.m} />
      {params?.invited && (
        <Typography.Body6 style={styles.invitedLabel}>
          {t('you have been invited')}
        </Typography.Body6>
      )}
      <Box alignSelf="stretch">
        <Button backgroundColor="rgba(255, 255, 255, 0.7)" onPress={() => onSignUp('mnemonic')}>
          {t('signUp with wallet')}
        </Button>
      </Box>
      <Spacer paddingTop={theme.spacing.xl} />
      <View style={styles.loginWithContainer}>
        <View style={styles.loginDivider} />
        <Spacer paddingHorizontal={8} />
        <Typography.Body5 style={styles.loginWithLabel}>{t('or sign in with')}</Typography.Body5>
        <Spacer paddingHorizontal={8} />
        <View style={styles.loginDivider} />
      </View>
      <View style={styles.bottomIcons}>
        {Platform.OS === 'ios' && (
          <ImageButton
            image={appleLoginIcon}
            style={styles.loginLogo}
            onPress={() => onSignUp(Web3AuthLoginProvider.Apple)}
          />
        )}
        <ImageButton
          image={googleLoginIcon}
          style={styles.loginLogo}
          onPress={() => onSignUp(Web3AuthLoginProvider.Google)}
        />
      </View>
    </DView>
  );
};

export default Landing;
