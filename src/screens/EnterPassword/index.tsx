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
import {SafeAreaView} from 'react-native-safe-area-context';
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
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <Typography.H3 style={styles.headerText}>{t('header')}</Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, errors, setValues, values}) => (
          <View style={styles.formContainer}>
            <Typography.Body1 style={styles.inputLabel}>
              {t('inputLabel')}
            </Typography.Body1>
            <DSecureTextInput
              placeholder={t('inputPlaceholder')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({password: text}, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Subtitle>{errors.password}</Typography.Subtitle>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <DButton onPress={handleSubmit} mode="contained">
                <Typography.Body1 style={styles.confirmButtonText}>
                  {t('common:confirm')}
                </Typography.Body1>
              </DButton>

              <TouchableOpacity
                style={styles.forgotPwButton}
                onPress={onPressForgotPassword}>
                <Typography.Body1>{t('forgotPassword')}</Typography.Body1>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default EnterPassword;
