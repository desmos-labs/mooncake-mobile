import React from 'react';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import DSecureTextInput from 'components/DSecureTextInput';
import {Image, KeyboardAvoidingView, Platform, View} from 'react-native';
import DButton from 'components/DButton';
import {Formik} from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import DView from 'components/DView';
import {check, validCheck} from 'assets/images';
import {passwordStrength} from 'check-password-strength';
import useStyles from './useStyles';

const initialFormValues = {
  newPassword: '',
  confirmPassword: '',
};

const ChangePassword = () => {
  const {t} = useTranslation('changePassword');

  const styles = useStyles();

  const handleFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [],
  );

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      newPassword: Yup.string()
        .min(
          6,
          t('error:minChar', {
            numChar: 6,
          }),
        )
        .required(t('error:required')),
      confirmPassword: Yup.string()
        .required(t('error:required'))
        .oneOf([Yup.ref('newPassword')], t('error:pwMustMatch')),
    });
  }, []);

  const mapPwStyle = React.useCallback((password: string) => {
    const {value} = passwordStrength(password);

    switch (value) {
      case 'Medium':
        return styles.mediumPw;
      case 'Strong':
        return styles.strongPw;
      default:
        return styles.weakPw;
    }
  }, []);

  return (
    <DView style={styles.container}>
      <Typography.H3 style={styles.headerText}>{t('header')}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, values, errors, setFieldValue}) => (
          <View style={styles.formContainer}>
            <View style={styles.labelGroup}>
              <Typography.Subtitle2>{t('enterNewPw')}</Typography.Subtitle2>

              {values.newPassword.length >= 6 && (
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
            />

            {errors.newPassword && (
              <Typography.Caption1 style={styles.errorText}>
                {errors.newPassword}
              </Typography.Caption1>
            )}

            <View style={styles.tooltipGroup}>
              <Image
                source={values.newPassword.length >= 6 ? validCheck : check}
                style={styles.check}
              />
              <Typography.Caption1
                style={values.newPassword.length >= 6 && styles.tooltipValid}>
                {t('atLeast6Char')}
              </Typography.Caption1>
            </View>

            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('confirmPw')}
            </Typography.Subtitle2>
            <DSecureTextInput
              placeholder={t('pw')}
              onChangeText={(value: string) =>
                setFieldValue('confirmPassword', value)
              }
            />
            {errors.confirmPassword && (
              <Typography.Caption1 style={styles.errorText}>
                {errors.confirmPassword}
              </Typography.Caption1>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <DButton
                onPress={handleSubmit}
                disabled={
                  !values.confirmPassword ||
                  !values.newPassword ||
                  _.flatten(Object.values(errors)).length > 0
                }
                mode="gradientFilled">
                <Typography.Button2 style={styles.confirmButtonText}>
                  {t('common:confirm')}
                </Typography.Button2>
              </DButton>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default ChangePassword;
