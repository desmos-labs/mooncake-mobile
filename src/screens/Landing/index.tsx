import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { landingPageAnimation } from 'assets/animations';
import { appleLoginIcon, googleLoginIcon, mooncakeTextYellow } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import { Image } from 'expo-image';
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
import { useIsLoginWithPrivateKeyEnabled, useResumeLoginFlow } from './hooks';
import useStyles from './useStyles';

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
  const { pendingLoginFlow, resumeLoginFlow, cancelLoginFlow } = useResumeLoginFlow();

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
  // --- Effects
  // -------------------------------------------------------------------------------------

  React.useEffect(() => {
    if (pendingLoginFlow) {
      navigate(ROUTES.CONFIRM_MODAL, {
        title: t('incomplete login'),
        subtitle: t('incomplete login description'),
        primaryButtonLabel: t('resume', { ns: 'common' }),
        onPressPrimary: resumeLoginFlow,
        secondaryButtonLabel: t('cancel', { ns: 'common' }),
        onPressSecondary: cancelLoginFlow,
        onDismiss: cancelLoginFlow,
      });
    }

    // Safe to ignore this, we want to execute this effect only the first time that
    // we enter in this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  const loginWithProvateKeyButton = React.useMemo(() => {
    return (
      <Button
        type="outline"
        style={styles.loginButton}
        onPress={() => onSignUp(LoginMethodPrivateKey)}>
        <Typography.Semibold16>{t('login with private key')}</Typography.Semibold16>
      </Button>
    );
  }, [onSignUp, styles.loginButton, t]);

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
          loginWithProvateKeyButton
        ) : (
          // Login buttons displayed when the login with private key is disabled.
          <>
            <Button
              type="outline"
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
                  type="outline"
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
            {__DEV__ && (
              <>
                <Spacer paddingTop="m" />
                {loginWithProvateKeyButton}
              </>
            )}
          </>
        )}
      </View>
    </DView>
  );
};

export default Landing;
