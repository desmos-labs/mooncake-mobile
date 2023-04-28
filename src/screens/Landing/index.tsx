import { appleLoginIcon, butterflyLandingIcon, googleLoginIcon, landingBG } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Box, Text, useTheme } from 'native-base';
import { usePerformImportAccount } from 'screens/Landing/hooks';
import Typography from 'components/Typography';
import ImageButton from 'components/ImageButton';
import useLoginWithWeb3Auth from 'hooks/useLoginWithWeb3Auth';
import { DesmosChain } from 'config/LinkableChains';
import { Web3AuthLoginProvider } from 'types/web3auth';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
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
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const performImportAccount = usePerformImportAccount();
  const { login: loginWithWeb3Auth, loginLoading } = useLoginWithWeb3Auth(DesmosChain);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const importFromSocial = useCallback(
    (social: Web3AuthLoginProvider) => {
      loginWithWeb3Auth(social);
    },
    [loginWithWeb3Auth],
  );

  const onSignUpWithWallet = React.useCallback(() => {
    performImportAccount();
  }, [performImportAccount]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      backgroundImage={landingBG}
      backgroundFillScreen
      style={styles.container}
      showLoadingOverlay={loginLoading}>
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
        <Button backgroundColor="rgba(255, 255, 255, 0.7)" onPress={onSignUpWithWallet}>
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
        <ImageButton
          image={appleLoginIcon}
          style={styles.loginLogo}
          onPress={() => importFromSocial(Web3AuthLoginProvider.Apple)}
        />
        <ImageButton
          image={googleLoginIcon}
          style={styles.loginLogo}
          onPress={() => importFromSocial(Web3AuthLoginProvider.Google)}
        />
      </View>
    </DView>
  );
};

export default Landing;
