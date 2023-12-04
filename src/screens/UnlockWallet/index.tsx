import { SigningMode } from '@desmoslabs/desmjs';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSetting } from '@recoil/settings';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { Formik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import useClearUserData from 'hooks/useClearUserData';
import useGetPasswordFromBiometrics from 'hooks/useGetPasswordFromBiometrics';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { ResultAsync } from 'neverthrow';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import useUnlockWalletWithPassword from 'screens/UnlockWallet/useHooks';
import { BiometricAuthorizations } from 'types/settings';
import { Wallet } from 'types/wallet';
import * as Yup from 'yup';
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
  /**
   * Custom screen subtitle.
   */
  readonly subtitleLabelOverride?: string;
  /**
   * Additional optional text.
   */
  readonly optionalBodyText?: string;
};

const initialFormValues = {
  password: '',
};

/**
 * Screen used to unlock the wallet during a transaction.
 * @constructor
 */
const UnlockWallet = () => {
  const { t } = useTranslation('enterPassword');
  const theme = useTheme();
  const styles = useStyles();

  const { params } = useRoute<NavProps['route']>();
  const {
    onSuccess,
    address,
    signingMode,
    onCancel,
    titleLabelOverride,
    subtitleLabelOverride,
    optionalBodyText,
  } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const biometrics = useSetting('biometrics');
  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const getPasswordFromBiometrics = useGetPasswordFromBiometrics(
    BiometricAuthorizations.UnlockWallet,
  );

  const clearUserData = useClearUserData();

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Form values
  // -------------------------------------------------------------------------------------

  // Validation schema for the form
  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, [t]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback used to unlock the wallet
  const unlockWallet = React.useCallback(
    async (
      unlockWalletPassword: string | undefined,
      formikHelpers?: FormikHelpers<typeof initialFormValues>,
    ) => {
      setLoading(true);
      if (unlockWalletPassword !== undefined) {
        const walletResult = await unlockWalletWithPassword(
          address,
          unlockWalletPassword,
          signingMode,
        );

        if (walletResult.isErr()) {
          setLoading(false);
          formikHelpers &&
            formikHelpers.setErrors({ password: t('incorrectPassword', { ns: 'error' }) });
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
            formikHelpers &&
              formikHelpers.setErrors({ password: t('error:incorrectPassword', { ns: 'error' }) });
          }
        }
      }
      setLoading(false);
    },
    [unlockWalletWithPassword, address, signingMode, t, onSuccess],
  );

  // Callback used when the user wants to unlock the wallet using the biometrics
  const unlockWalletWithBiometrics = React.useCallback(async () => {
    const biometricsPasswordResult = await getPasswordFromBiometrics();
    if (biometricsPasswordResult.isOk()) {
      await unlockWallet(biometricsPasswordResult.value);
    } else {
      setLoading(false);
    }
  }, [getPasswordFromBiometrics, unlockWallet]);

  // Callback used when the user submits the form to unlock the wallet using the password
  const onFormSubmit = React.useCallback(
    async (
      formValues: typeof initialFormValues,
      formikHelpers?: FormikHelpers<typeof initialFormValues>,
    ) => {
      unlockWallet(formValues.password, formikHelpers);
    },
    [unlockWallet],
  );

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  // Cancel if the user close this screen.
  useOnBackAction(() => onCancel !== undefined && onCancel(), [onCancel]);

  React.useEffect(() => {
    if (biometrics) {
      setLoading(true);
      // Use a timeout to allow the application to show the screen
      // before displaying the os biometrics modal.
      setTimeout(unlockWalletWithBiometrics, 500);
    }

    // It's fine to disable the exhaustive deps here because we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>{titleLabelOverride || t('header')}</Typography.H3>
      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({ handleSubmit, errors, setValues, values }) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {subtitleLabelOverride || t('inputLabel')}
            </Typography.Subtitle2>
            {optionalBodyText && (
              <>
                <Typography.Body6 style={styles.optionalBody}>{optionalBodyText}</Typography.Body6>
                {subtitleLabelOverride && (
                  <Typography.Subtitle2 style={styles.inputLabel}>
                    {t('inputLabel')}
                  </Typography.Subtitle2>
                )}
              </>
            )}
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
                {t('next', { ns: 'common' })}
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
