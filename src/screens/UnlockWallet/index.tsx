import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSetting } from '@recoil/settings';
import Button from 'components/CustomButton';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { Formik } from 'formik';
import useClearUserData from 'hooks/useClearUserData';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import * as Yup from 'yup';
import { Wallet } from 'types/wallet';
import { SigningMode } from '@desmoslabs/desmjs';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import { BiometricAuthorizations } from 'types/settings';
import { ResultAsync } from 'neverthrow';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import useUnlockWalletWithPassword from 'screens/UnlockWallet/useHooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_WALLET>;

export type UnlockWalletParams = {
  /**
   * Function called if the user correctly unlocks the wallet.
   */
  readonly onSuccess: (wallet: Wallet) => any;
  /**
   * Address of the wallet to unlock.
   */
  readonly address: string;
  /**
   * Wallet signing mode
   */
  readonly signingMode?: SigningMode;
  /**
   * Callback called if the user cancel the procedure.
   */
  readonly onCancel?: () => any;
  /**
   * Custom screen title.
   */
  readonly titleLabelOverride?: string;
};

const initialFormValues = {
  password: '',
};

const UnlockWallet = () => {
  const {
    params: { onSuccess, address, signingMode, onCancel, titleLabelOverride },
  } = useRoute<NavProps['route']>();
  const [loading, setLoading] = useState(false);
  const biometrics = useSetting('biometrics');
  const { t } = useTranslation('enterPassword');
  const [passwordError, setPasswordError] = useState<string>();
  const clearUserData = useClearUserData();
  const styles = useStyles();
  const theme = useTheme();
  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(
    BiometricAuthorizations.UnlockWallet,
  );
  const unlockWalletWithPassword = useUnlockWalletWithPassword();

  // Cancel if the user close this screen.
  useOnBackAction(() => onCancel !== undefined && onCancel(), [onCancel]);

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, [t]);

  const unlockWallet = React.useCallback(
    async (unlockWalletPassword: string | undefined) => {
      setLoading(true);
      if (unlockWalletPassword !== undefined) {
        const walletResult = await unlockWalletWithPassword(
          address,
          unlockWalletPassword,
          signingMode,
        );

        if (walletResult.isErr()) {
          setLoading(false);
          setPasswordError(walletResult.error.message);
          return;
        }

        if (walletResult.value !== undefined) {
          const result = await ResultAsync.fromPromise(
            walletResult.value.signer.connect(),
            () => new Error('Failed to connect to signer'),
          );
          if (result.isOk()) {
            onSuccess(walletResult.value);
          } else {
            setPasswordError(result.error.message);
          }
        }
      }
      setLoading(false);
    },
    [unlockWalletWithPassword, address, signingMode, onSuccess],
  );

  const unlockWalletWithBiometrics = React.useCallback(async () => {
    const biometricPassword = await getPasswordFromBiometrics();
    if (biometricPassword.isOk()) {
      await unlockWallet(biometricPassword.value);
    } else {
      setLoading(false);
    }
  }, [getPasswordFromBiometrics, unlockWallet]);

  const onFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      unlockWallet(formValues.password);
    },
    [unlockWallet],
  );

  React.useEffect(() => {
    if (biometrics) {
      setLoading(true);
      // Use a timeout to allow the application to show the screen
      // before displaying the os biometrics modal.
      setTimeout(unlockWalletWithBiometrics, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>{titleLabelOverride || t('header')}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}
        initialErrors={{ password: passwordError }}>
        {({ handleSubmit, errors, setValues, values }) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>{t('inputLabel')}</Typography.Subtitle2>
            <DSecureTextInput
              style={styles.textInput}
              autoFocus={!biometrics}
              placeholder={t('inputPlaceholder')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({ password: text }, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Caption1 style={styles.errorText}>{errors.password}</Typography.Caption1>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <Button
                isLoading={loading}
                backgroundColor={theme.colors.surfaceBlack}
                textColor={theme.colors.white}
                disabled={!values.password || Object.values(errors).length > 0}
                onPress={handleSubmit as any}
                size={44}>
                {t('common:next')}
              </Button>

              <TouchableOpacity style={styles.forgotPwButton} onPress={clearUserData}>
                <Typography.Button2>{t('forgotPassword')}</Typography.Button2>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default UnlockWallet;
