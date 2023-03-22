import { useFocusEffect, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon, landingBG } from 'assets/images';
import Button from 'components/CustomButton';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import useCustomToast from 'hooks/extended/useCustomToast';
import { useSetting } from '@recoil/settings';
import useClearUserData from 'hooks/useClearUserData';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import { BiometricAuthorizations } from 'types/settings';
import useOnSubmitPassword from 'screens/Login/hooks';
import CommonStyles from 'config/theme/CommonStyles';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LOGIN>;

export type LoginParams = {
  /**
   * Callback to be executed if login is successful.
   */
  onSuccess?: () => void;
};

/**
 * Screen that allows the user to log into the app.
 * @constructor
 */
const Login = () => {
  const styles = useStyles();
  const { t } = useTranslation('login');
  const theme = useTheme();

  const { params } = useRoute<NavProps['route']>();
  const onSuccess = params?.onSuccess;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToHome = useNavigateToHome();

  const toast = useCustomToast();
  const areBiometricsEnabled = useSetting('biometrics');
  const clearUserData = useClearUserData();

  const getPasswordWithBiometrics = useGetPasswordFromBiometrics(BiometricAuthorizations.Login);
  const onSubmitPassword = useOnSubmitPassword();

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [loading, setLoading] = React.useState(false);
  const [biometricsLoading, setBiometricsLoading] = useState(false);
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback to be executed when the user has activated the biometrics login
  const unlockWithBiometrics = React.useCallback(async () => {
    setBiometricsLoading(true);

    // Get the password from the biometrics
    const passwordResult = await getPasswordWithBiometrics();
    if (passwordResult.isErr()) {
      setBiometricsLoading(false);

      const err = passwordResult.error.message;
      if (!err.toLowerCase().includes('cancel')) {
        // Disable wrong password error if user cancels biometrics
        setError(t('error:incorrectPassword'));
      }
      return;
    }

    // Check the password value
    const biometricsPassword = passwordResult.value;
    if (!biometricsPassword) {
      setBiometricsLoading(false);
      setError(t('error:incorrectPassword'));
      return;
    }

    // Perform the regular login
    const loginResult = await onSubmitPassword(biometricsPassword);
    if (loginResult.isErr()) {
      setBiometricsLoading(false);
      toast.errorNoRetry(t('toast:errorLogin'));
      return;
    }

    // Navigate to the home page, and call the onSuccess method if defined
    // We don't need to set the loading to false, as we will navigate away from here anyway
    navigateToHome();
    onSuccess && onSuccess();
  }, [getPasswordWithBiometrics, navigateToHome, onSubmitPassword, onSuccess, t, toast]);

  const handleSubmit = React.useCallback(async () => {
    setLoading(true);

    // Perform the regular login
    const loginResult = await onSubmitPassword(password);
    if (loginResult.isErr()) {
      setLoading(false);
      toast.errorNoRetry(t('toast:errorLogin'));
      return;
    }

    // Navigate to the home page, and call the onSuccess method if defined
    // We don't need to set the loading to false, as we will navigate away from here anyway
    navigateToHome();
    onSuccess && onSuccess();
  }, [onSubmitPassword, password, navigateToHome, onSuccess, toast, t]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // If the user has enabled the biometrics login, ask that as soon as the screen renders
  useFocusEffect(
    React.useCallback(() => {
      if (areBiometricsEnabled) {
        unlockWithBiometrics();
      }
    }, [areBiometricsEnabled, unlockWithBiometrics]),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      showLoadingOverlay={biometricsLoading}
      backgroundImage={landingBG}
      backgroundFillScreen
      style={styles.container}>
      <KeyboardAvoidingView
        style={CommonStyles.flex[1]}
        contentContainerStyle={CommonStyles.flexGrow[1]}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
        <Image source={butterflyLandingIcon} style={styles.logo} />
        <Spacer paddingVertical={theme.spacing.s}>
          <Typography.Body1 style={styles.title}>{t('welcomeBack')}</Typography.Body1>
        </Spacer>
        <Typography.Body1 style={styles.subtitle}>{t('logBackIn')}</Typography.Body1>

        <View style={styles.contentContainer}>
          <Typography.Subtitle2 style={styles.labelStyle}>{t('password')}</Typography.Subtitle2>
          <DSecureTextInput
            autoFocus={!areBiometricsEnabled}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('enterPassword')}
          />

          {error && <Typography.Caption1 style={styles.errorStyle}>{error}</Typography.Caption1>}

          <Spacer paddingTop={theme.spacing.m}>
            <Button
              size={56}
              textColor="white"
              disabled={loading || !password}
              isLoading={loading}
              onPress={handleSubmit}
              borderColor={theme.colors.white}
              variant="outlined">
              {t('common:confirm')}
            </Button>
          </Spacer>
        </View>

        <View style={styles.bottomContentContainer}>
          <TouchableOpacity
            disabled={loading}
            style={styles.forgotPwButton}
            onPress={clearUserData}>
            <Typography.Button1 style={styles.labelStyle}>{t('forgotPassword')}</Typography.Button1>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default Login;
