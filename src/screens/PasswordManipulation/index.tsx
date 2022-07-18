import React from 'react';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import DSecureTextInput from 'components/DSecureTextInput';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import DButton from 'components/DButton';
import {Formik} from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';
import DView from 'components/DView';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
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

const PasswordManipulation = () => {
  const {t} = useTranslation('passwordManipulation');

  const {
    params: {mode},
  } = useRoute<NavProps['route']>();

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

  const styles = useStyles();

  const handleFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [mode],
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

  return (
    <DView style={styles.container}>
      <Typography.H3 style={styles.headerText}>{headerText}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, values, errors, setFieldValue}) => (
          <View style={styles.formContainer}>
            <Typography.Body1 style={styles.inputLabel}>
              {t('enterNewPw')}
            </Typography.Body1>
            <DSecureTextInput
              value={values.newPassword}
              onChangeText={(value: string) =>
                setFieldValue('newPassword', value, true)
              }
              style={styles.inputLabel}
              placeholder={t('newPw')}
            />

            {errors.newPassword && (
              <Typography.Subtitle2 style={styles.errorText}>
                {errors.newPassword}
              </Typography.Subtitle2>
            )}

            <Typography.Body1 style={styles.tooltipText}>
              {t('atLeast6Char')}
            </Typography.Body1>
            <Typography.Body1 style={styles.inputLabel}>
              {t('confirmPw')}
            </Typography.Body1>
            <DSecureTextInput
              placeholder={t('pw')}
              onChangeText={(value: string) =>
                setFieldValue('confirmPassword', value)
              }
            />
            {errors.confirmPassword && (
              <Typography.Subtitle2 style={styles.errorText}>
                {errors.confirmPassword}
              </Typography.Subtitle2>
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
                mode="contained">
                <Typography.Body1 style={styles.confirmButtonText}>
                  {t('common:confirm')}
                </Typography.Body1>
              </DButton>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default PasswordManipulation;
