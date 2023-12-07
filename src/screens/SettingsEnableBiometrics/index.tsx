import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSetSetting } from '@recoil/settings';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { Formik, FormikHelpers } from 'formik';
import { SecureStorageErrorType } from 'lib/SecureStorage/errors';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import useStyles from 'screens/SettingsEnableBiometrics/useStyles';
import { FormValues, useInitialFormValues, useValidationSchema } from './hooks';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_ENABLE_BIOMETRICS>;

/**
 * Screen that allows the user to enable the biometric authentication.
 * @constructor
 */
const SettingsEnableBiometrics = () => {
  const { t } = useTranslation('password');
  const styles = useStyles();
  const theme = useTheme();

  const { goBack } = useNavigation<NavProps['navigation']>();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const setBiometricsSetting = useSetSetting('biometrics');
  const initialFormValues = useInitialFormValues();
  const validationSchema = useValidationSchema();
  const enableBiometrics = useEnableBiometrics();

  // -------------------------------------------------------------------------------------
  // --- Screen state
  // -------------------------------------------------------------------------------------

  const [loading, setLoading] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const onFormSubmit = useCallback(
    async (values: FormValues, { setErrors }: FormikHelpers<FormValues>) => {
      setLoading(true);
      const result = await enableBiometrics(values.password);
      if (result.isErr()) {
        // Set the errors inside the UI
        if (result.error.type === SecureStorageErrorType.WrongPassword) {
          setErrors({ password: t('incorrect password', { ns: 'password' }) });
        } else {
          setErrors({ password: result.error.message });
        }
      } else {
        setBiometricsSetting(true);
        goBack();
      }

      // Set the loading to false
      setLoading(false);
    },
    [enableBiometrics, goBack, setBiometricsSetting, t],
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={styles.container} backgroundColor={theme.colors.white} topBar={<TopBar />}>
      <Typography.H3 style={styles.headerText}>{t('header')}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({ handleSubmit, errors, setValues, values }) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>{t('inputLabel')}</Typography.Subtitle2>
            <DSecureTextInput
              style={styles.textInput}
              autoFocus={true}
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
                onPress={handleSubmit as any}>
                {t('next', { ns: 'common' })}
              </Button>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default SettingsEnableBiometrics;
