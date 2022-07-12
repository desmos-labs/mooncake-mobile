import {StackScreenProps} from '@react-navigation/stack';
import DButton from 'components/DButton';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import * as Yup from 'yup';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const RevealRecoveryPhrase: React.FC<Props> = props => {
  const {t} = useTranslation();
  const styles = useStyles();

  const initialFormValues = {
    password: '',
  };

  const onFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      console.log(formValues);
    },
    [],
  );

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, []);

  return (
    <DView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.H3>{t('settings:reveal secret phrase')}</Typography.H3>
      <Typography.Body6 style={{marginBottom: 52, marginTop: 20}}>
        {t('settings:secret recovery passphrase message')}
      </Typography.Body6>
      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, errors, setValues, values}) => (
          <View style={styles.formContainer}>
            <Typography.Body6 style={styles.inputLabel}>
              {t('enterPassword:inputPlaceholder')}
            </Typography.Body6>
            <DSecureTextInput
              placeholder={t('password')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({password: text}, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Body6 style={styles.errorText}>
                {errors.password}
              </Typography.Body6>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 340 : 0}
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
                  {t('common:next')}
                </Typography.Button1>
              </DButton>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default RevealRecoveryPhrase;
