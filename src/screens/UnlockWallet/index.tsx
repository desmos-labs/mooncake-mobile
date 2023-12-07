import { SigningMode } from '@desmoslabs/desmjs';
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSetting } from '@recoil/settings';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Formik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import useOnBackAction from 'hooks/navigation/useOnBackAction';
import useClearUserData from 'hooks/useClearUserData';
import { getBiometricPassword } from 'lib/SecureStorage';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { ResultAsync } from 'neverthrow';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import useUnlockWalletWithPassword from 'screens/UnlockWallet/useHooks';
import { Wallet } from 'types/wallet';
import * as Yup from 'yup';
import useStyles from './useStyles';

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.UNLOCK_WALLET>;

export type UnlockWalletParams = {
  /**
   * Function called if the user correctly unlocks the wallet.
   */
  readonly onSuccess: (wallet: Wallet, password: string) => any;
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
  const { t } = useTranslation('password');
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

  const clearUserData = useClearUserData();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const unlockWithBiometrics = useSetting('biometrics');
  const unlockWalletWithPassword = useUnlockWalletWithPassword();
  const blockBackAction = React.useRef(false);

  // -------------------------------------------------------------------------------------
  // --- Local state
  // -------------------------------------------------------------------------------------

  const [biometricsPsw, setBiometricPsw] = useState('');
  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Form values
  // -------------------------------------------------------------------------------------

  // Validation schema for the form
  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('field required', { ns: 'common' })),
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
          formikHelpers && formikHelpers.setErrors({ password: t('incorrect password') });
          return;
        }

        if (walletResult.value !== undefined) {
          const result = await ResultAsync.fromPromise(
            walletResult.value.signer.connect(),
            () => new Error('Failed to connect to signer'),
          );
          if (result.isOk()) {
            // Block the back action handle.
            blockBackAction.current = true;
            onSuccess(walletResult.value, unlockWalletPassword);
          } else {
            formikHelpers && formikHelpers.setErrors({ password: t('incorrect password') });
          }
        }
      }
      setLoading(false);
    },
    [unlockWalletWithPassword, address, signingMode, t, onSuccess],
  );

  /**
   * Callback used to unlock the wallet using the biometrics.
   * This callback is called only if the user has enabled the biometrics unlock option.
   */
  const unlockWalletWithBiometrics = React.useCallback(async () => {
    const biometricPassword = await getBiometricPassword();
    // User cancel the biometric unlock procedure.
    if (biometricPassword === undefined) {
      setLoading(false);
      return;
    }
    setBiometricPsw(biometricPassword);
    await unlockWallet(biometricPassword);
  }, [unlockWallet]);

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

  /**
   * Effect used to unlock the wallet using the biometrics if the user has enabled this option.
   * This effect is called only once when the screen is mounted.
   */
  useEffect(() => {
    if (unlockWithBiometrics) {
      setLoading(true);
      // Use a timeout to allow the application to show the screen
      // before displaying the os biometrics modal.
      setTimeout(unlockWalletWithBiometrics, 100);
    }

    // It's fine to disable the exhaustive deps check here because we only want to run this effect only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>
        {titleLabelOverride || t('unlock wallet')}
      </Typography.H3>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={CommonStyles.flex['1']}>
        <Formik
          initialValues={initialFormValues}
          onSubmit={onFormSubmit}
          validationSchema={validationSchema}>
          {({ handleSubmit, errors, setValues, values }) => (
            <View style={styles.formContainer}>
              <Typography.Subtitle2 style={styles.inputLabel}>
                {subtitleLabelOverride || t('password')}
              </Typography.Subtitle2>
              {optionalBodyText && (
                <>
                  <Typography.Body6 style={styles.optionalBody}>
                    {optionalBodyText}
                  </Typography.Body6>
                  {subtitleLabelOverride && (
                    <Typography.Subtitle2 style={styles.inputLabel}>
                      {t('password')}
                    </Typography.Subtitle2>
                  )}
                </>
              )}
              <DSecureTextInput
                style={styles.textInput}
                autoFocus={!unlockWalletWithBiometrics}
                placeholder={t('enter password')}
                value={unlockWithBiometrics ? biometricsPsw : values.password}
                onChangeText={(text: string) => {
                  setValues({ password: text }, true);
                }}
                error={!!errors.password}
              />
              {errors.password && (
                <Typography.Caption1 style={styles.errorText}>
                  {errors.password}
                </Typography.Caption1>
              )}
              <View style={styles.buttonGroup}>
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
                  <Typography.Button2>{t('forgot password')}</Typography.Button2>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default UnlockWallet;
