import React from 'react';
import Typography from 'components/Typography';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import DSecureTextInput from 'components/DSecureTextInput';
import {Formik} from 'formik';
import * as Yup from 'yup';
import DButton from 'components/DButton';
import _ from 'lodash';
import DView from 'components/DView';
import useStyles from './useStyles';

const initialFormValues = {
  password: '',
};

const EnterPassword = () => {
  const {t} = useTranslation('enterPassword');

  const styles = useStyles();

  const onFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [],
  );

  const onPressForgotPassword = () => {
    // TODO: implementation once forgot password flow is defined
  };

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, []);

  return (
    <DView style={styles.container}>
      <Typography.H3 style={styles.headerText}>{t('header')}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, errors, setValues, values}) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('inputLabel')}
            </Typography.Subtitle2>
            <DSecureTextInput
              placeholder={t('inputPlaceholder')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({password: text}, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Subtitle2 style={styles.errorText}>
                {errors.password}
              </Typography.Subtitle2>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <DButton
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                onPress={handleSubmit}
                mode="contained">
                <Typography.Button1 style={styles.confirmButtonText}>
                  {t('common:confirm')}
                </Typography.Button1>
              </DButton>

              <TouchableOpacity
                style={styles.forgotPwButton}
                onPress={onPressForgotPassword}>
                <Typography.Button2>{t('forgotPassword')}</Typography.Button2>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default EnterPassword;
