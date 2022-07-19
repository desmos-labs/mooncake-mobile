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
import {useRoute, useNavigation} from '@react-navigation/native';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useTranslation} from 'react-i18next';
import * as Yup from 'yup';
import PasswordTooltip from 'screens/PasswordManipulation/components/PasswordTooltip';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const initialFormValues = {
  newPassword: '',
  confirmPassword: '',
};

export enum PASSWORD_MANIPULATION_MODE {
  CHANGE_PASSWORD,
  RESET_PASSWORD,
}

export type PasswordManipulationParams = {
  mode: PASSWORD_MANIPULATION_MODE;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.PASSWORD_MANIPULATION
>;

const MIN_PW_LENGTH = 10;

const PasswordManipulation = () => {
  const {t} = useTranslation('passwordManipulation');

  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

  const theme = useTheme();

  const headerText = React.useMemo(() => {
    switch (mode) {
      case PASSWORD_MANIPULATION_MODE.CHANGE_PASSWORD:
        return 'changePw';
      case PASSWORD_MANIPULATION_MODE.RESET_PASSWORD:
        return 'resetPw';
      default:
        return '';
    }
  }, [mode]);

  const {navigate} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();

  const handleFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);

      navigate(ROUTES.RESULT_MODAL, {
        title: t('resultModal:success'),
        subtitle: t('resultModal:passwordWasChanged'),
        primaryButtonLabel: t('resultModal:goToProfile'),
        onDismiss: () => {
          // finish implementation when change pw feature is added
        },
      });
    },
    [mode],
  );

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
        .test('at least one lowercase', '', value =>
          /(?=.*[a-z])/.test(value as string),
        )
        .test('at least one uppercase', '', value =>
          /(?=.*[A-Z])/.test(value as string),
        )
        .test('at least one special', '', value =>
          /(?=.*\W)/.test(value as string),
        ),
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
      <Typography.H3 style={styles.headerText}>{t(headerText)}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, values, errors, setFieldValue}) => {
          console.log(errors);
          return (
            <View style={styles.formContainer}>
              <View style={styles.labelGroup}>
                <Typography.Subtitle2>{t('enterNewPw')}</Typography.Subtitle2>

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

              <PasswordTooltip
                label={t('atLeastChar', {
                  length: MIN_PW_LENGTH,
                })}
                isSatisfied={values.newPassword.length >= MIN_PW_LENGTH}
              />

              <PasswordTooltip
                label={t('atLeastLower')}
                isSatisfied={/(?=.*[a-z])/.test(values.newPassword)}
              />

              <PasswordTooltip
                label={t('atLeastUpper')}
                isSatisfied={/(?=.*[A-Z])/.test(values.newPassword)}
              />

              <Spacer paddingBottom={theme.spacing.m}>
                <PasswordTooltip
                  label={t('atLeastSpecial')}
                  isSatisfied={/(?=.*\W)/.test(values.newPassword)}
                />
              </Spacer>

              <Typography.Subtitle2 style={styles.inputLabel}>
                {t('confirmPw')}
              </Typography.Subtitle2>
              <DSecureTextInput
                placeholder={t('pw')}
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
                keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.buttonGroup}>
                <Button
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
