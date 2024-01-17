import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { appleLoginIcon, googleLoginIcon, mooncakeTextYellow } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import {
  LoginMethod,
  LoginMethodPrivateKey,
  LoginMethodWeb3AuthApple,
  LoginMethodWeb3AuthGoogle,
} from 'types/login';
import ThemedLottieView from 'components/ThemedLottieView';
import { landingPageAnimation } from 'assets/animations';
import { Image } from 'expo-image';
import useStyles from './useStyles';
import { useIsLoginWithPrivateKeyEnabled } from './hooks';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

/**
 * Screen that is shown to the user when they open the application for the first time.
 * From here, they can decide to create a new account, or import an existing one.
 * @constructor
 */

const Landing = () => {
  const theme = useTheme();
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------
  const loginWithPrivateKeyEnabled = useIsLoginWithPrivateKeyEnabled();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onSignUp = React.useCallback(
    (loginMethod: LoginMethod) => {
      // Handle the post consent behavior with a reusable callback.
      navigate(ROUTES.SERVICE_AND_POLICY, {
        loginMethod,
      });
    },
    [navigate],
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={styles.container}>
      <View style={styles.innerView}>
        {/* Butter animation with text */}
        <ThemedLottieView style={styles.animation} source={landingPageAnimation} autoPlay loop />
        <Spacer paddingTop={20} />
        <Image style={styles.mooncakeText} source={mooncakeTextYellow} />
        <Spacer paddingTop={40} />
        <Typography.Regular16 allowFontScaling>{t('mooncake slogan')}</Typography.Regular16>
        <Spacer paddingTop={theme.spacing.m} />
        <Spacer paddingTop={40} />
        {/* Login buttons */}
        {loginWithPrivateKeyEnabled ? (
          <Button
            variant="outline"
            style={styles.loginButton}
            onPress={() => onSignUp(LoginMethodPrivateKey)}>
            <Typography.Semibold16>{t('login with private key')}</Typography.Semibold16>
          </Button>
        ) : (
          // Login buttons displayed when the login with private key is disabled.
          <>
            <Button
              variant="outline"
              style={styles.loginButton}
              height={52}
              onPress={() => onSignUp(LoginMethodWeb3AuthGoogle)}>
              <View style={styles.loginTextWithLogoContainer}>
                <Image style={styles.loginLogo} source={googleLoginIcon} />
                <Typography.Semibold16>{t('continue with google')}</Typography.Semibold16>
              </View>
            </Button>
            {Platform.OS === 'ios' && (
              <>
                <Spacer paddingTop="m" />
                <Button
                  variant="outline"
                  style={styles.loginButton}
                  height={52}
                  onPress={() => onSignUp(LoginMethodWeb3AuthApple)}>
                  <View style={styles.loginTextWithLogoContainer}>
                    <Image style={styles.loginLogo} source={appleLoginIcon} />
                    <Typography.Semibold16>{t('continue with apple')}</Typography.Semibold16>
                  </View>
                </Button>
              </>
            )}
          </>
        )}
      </View>
    </DView>
  );
};

export default Landing;
