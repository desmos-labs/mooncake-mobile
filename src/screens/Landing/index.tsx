import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { mooncakeAnimationWhite } from 'assets/animations';
import {
  appleLoginIcon,
  dpmIcon,
  googleLoginIcon,
  leapWalletIcon,
  mooncakeTextWhite,
} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import ThemedLottieView from 'components/ThemedLottieView';
import commonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useIsLoginFlowUncompleted from 'hooks/login/useIsLoginFlowUncompleted';
import useResumeLoginFlow from 'hooks/login/useResumeLoginFlow';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
  LoginMethod,
  LoginMethodPrivateKey,
  LoginMethodType,
  LoginMethodWeb3AuthApple,
  LoginMethodWeb3AuthGoogle,
} from 'types/login';
import { WalletConnectWalletApp } from 'types/wallet';
import { useIsLoginWithPrivateKeyEnabled } from './hooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LANDING>;

/**
 * Screen that is shown to the user when they open the application for the first time.
 * From here, they can decide to create a new account, or import an existing one.
 * @constructor
 */
const Landing = () => {
  const { navigate } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation('landing');
  const styles = useStyles();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const loginWithPrivateKeyEnabled = useIsLoginWithPrivateKeyEnabled();
  const pendingLoginFlow = useIsLoginFlowUncompleted();
  const { resumeLoginFlow, cancelLoginFlow } = useResumeLoginFlow();

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

  const signUpWithDpm = useCallback(() => {
    onSignUp({
      type: LoginMethodType.WalletConnect,
      app: WalletConnectWalletApp.DPM,
    });
  }, [onSignUp]);

  const signUpWithLeap = useCallback(() => {
    onSignUp({
      type: LoginMethodType.WalletConnect,
      app: WalletConnectWalletApp.Leap,
    });
  }, [onSignUp]);

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
        removeModalAfterButtonPress: true,
      });
    }

    // Safe to ignore this, we want to execute this effect only the first time that
    // we enter this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  const loginWithPrivateKeyButton = React.useMemo(() => {
    return (
      <Button
        type="solid"
        style={styles.loginButton}
        onPress={() => onSignUp(LoginMethodPrivateKey)}>
        <Typography.Semibold16>{t('login with private key')}</Typography.Semibold16>
      </Button>
    );
  }, [onSignUp, styles.loginButton, t]);

  return (
    <DView style={styles.container} gradientColors={['#FFAB2D', '#FFE03E']}>
      <View style={styles.innerView}>
        {/* Butter animation with text */}
        <ThemedLottieView style={styles.animation} source={mooncakeAnimationWhite} autoPlay loop />
        <Spacer paddingTop={20} />
        <Image style={styles.mooncakeText} source={mooncakeTextWhite} />
        <Spacer paddingTop={30} />
        <Typography.Regular16 allowFontScaling style={commonStyles.textWhite}>
          {t('mooncake slogan')}
        </Typography.Regular16>
        <Spacer paddingTop={40} />
        {/* Login buttons */}
        {loginWithPrivateKeyEnabled ? (
          loginWithPrivateKeyButton
        ) : (
          // Login buttons displayed when the login with private key is disabled.
          <>
            <Button
              type="solid"
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
                  type="solid"
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
                {loginWithPrivateKeyButton}
              </>
            )}
          </>
        )}
        {/* Sign-in with WalletConnect wallets */}
        <View style={styles.signinWithContainer}>
          <View style={styles.signinWithDivider} />
          <Typography.Regular16 style={styles.signinWithText}>
            {t('or sign in with')}
          </Typography.Regular16>
          <View style={styles.signinWithDivider} />
        </View>
        {/* Apps buttons */}
        <View style={styles.appsContainer}>
          <TouchableOpacity onPress={signUpWithDpm}>
            <Image source={dpmIcon} style={styles.appButton} />
          </TouchableOpacity>
          <TouchableOpacity onPress={signUpWithLeap}>
            <Image
              source={leapWalletIcon}
              style={[styles.appButton, styles.appButtonMargin, styles.whiteBackground]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </DView>
  );
};

export default Landing;
