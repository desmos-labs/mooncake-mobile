import React from 'react';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {passwordStrength} from 'check-password-strength';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import * as Yup from 'yup';
import PasswordReqGroup from 'components/PasswordReqGroup';
import {
  MIN_PW_LENGTH,
  validateMin1Lowercase,
  validateMin1SpecialChar,
  validateMin1Uppercase,
} from 'lib/ValidationUtils';
import useStyles from './useStyles';
import useHooks from './useHooks';

export enum PASSWORD_MANIPULATION_MODE {
  CHANGE_PASSWORD,
  RESET_PASSWORD,
  SETUP_PASSWORD,
}

export type PasswordManipulationParams = {
  mode: PASSWORD_MANIPULATION_MODE;

  /**
   * If a mnemonic is passed with mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
   * it means the user is importing an account using a recovery phrase
   */
  mnemonic?: string;
};

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.PASSWORD_MANIPULATION
>;

const PasswordManipulation = () => {
  const {t} = useTranslation('passwordManipulation');

  const {top} = useSafeAreaInsets();

  const styles = useStyles();

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      newPassword: Yup.string()
        .min(
          MIN_PW_LENGTH,
          t('error:minChar', {
            numChar: MIN_PW_LENGTH,
          }),
        )
        .required(t('error:required'))
        .test('at least one lowercase', '', validateMin1Lowercase)
        .test('at least one uppercase', '', validateMin1Uppercase)
        .test('at least one special', '', validateMin1SpecialChar),
      confirmPassword: Yup.string()
        .required(t('error:required'))
        .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
    });
  }, []);

  const {
    headerText,
    descriptionText,
    pwInputLabel,
    buttonLabel,
    handleFormSubmit,
    mapPwStyle,
    initialFormValues,
  } = useHooks();

  return (
    <DView style={styles.container} scrollable>
      <Typography.H3 style={styles.headerText}>{t(headerText)}</Typography.H3>

      {descriptionText && (
        <Spacer paddingBottom={32}>
          <Typography.Body6>{t(descriptionText)}</Typography.Body6>
        </Spacer>
      )}

      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, values, errors, setFieldValue}) => {
          return (
            <View style={styles.formContainer}>
              <View style={styles.labelGroup}>
                <Typography.Subtitle2>{t(pwInputLabel)}</Typography.Subtitle2>

                {values.newPassword.length >= MIN_PW_LENGTH && (
                  <Typography.Subtitle4 style={mapPwStyle(values.newPassword)}>
                    {t(passwordStrength(values.newPassword).value)}
                  </Typography.Subtitle4>
                )}
              </View>

              <DSecureTextInput
                value={values.newPassword}
                onChangeText={(value: string) =>
                  setFieldValue('newPassword', value, true)
                }
                style={styles.inputLabel}
                placeholder={t('newPw')}
                error={!!errors.newPassword}
              />

              {errors.newPassword && (
                <Typography.Caption1 style={styles.errorText}>
                  {errors.newPassword}
                </Typography.Caption1>
              )}

              <PasswordReqGroup passwordToCheck={values.newPassword} />

              <Typography.Subtitle2 style={styles.inputLabel}>
                {t('confirmPw')}
              </Typography.Subtitle2>
              <DSecureTextInput
                placeholder={t('pw')}
                value={values.confirmPassword}
                onChangeText={(value: string) =>
                  setFieldValue('confirmPassword', value, true)
                }
                error={!!errors.confirmPassword}
              />
              {errors.confirmPassword && (
                <Typography.Caption1 style={styles.errorText}>
                  {errors.confirmPassword}
                </Typography.Caption1>
              )}

              <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.OS === 'ios' ? top + 180 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <Button
                  onPress={handleSubmit}
                  disabled={
                    values.confirmPassword.length === 0 ||
                    values.newPassword.length === 0 ||
                    _.flatten(Object.values(errors)).length > 0
                  }
                  mode="gradientFilled">
                  <Typography.Button2 style={styles.confirmButtonText}>
                    {t(buttonLabel)}
                  </Typography.Button2>
                </Button>
              </KeyboardAvoidingView>
            </View>
          );
        }}
      </Formik>
    </DView>
  );
};

export default PasswordManipulation;
