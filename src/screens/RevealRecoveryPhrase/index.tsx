import {StackScreenProps} from '@react-navigation/stack';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Yup from 'yup';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const RevealRecoveryPhrase: React.FC<Props> = props => {
  const {navigation} = props;
  const {t} = useTranslation();
  const styles = useStyles();

  const initialFormValues = {
    password: '',
  };

  const onFormSubmit = React.useCallback(
    (formValues: typeof initialFormValues) => {
      // if password is correct, navigate to the next screen
      console.log(formValues);
      navigation.navigate(ROUTES.SETTINGS_SHOW_SECRET_PHRASE);
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
            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('settings:enter password to continue')}
            </Typography.Subtitle2>
            <DSecureTextInput
              placeholder={t('enterPassword:inputPlaceholder')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({password: text}, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Caption1 style={styles.errorText}>
                {errors.password}
              </Typography.Caption1>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 340 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                style={[
                  styles.button,
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                    ? styles.disabled
                    : null,
                ]}>
                <LinearGradient
                  style={styles.gradient}
                  colors={[
                    'rgba(255, 199, 91, 1)',
                    'rgba(255, 132, 79, 1)',
                    'rgba(255, 132, 79, 1)',
                    'rgba(255, 132, 79, 1)',
                  ]}>
                  <Typography.Button1 style={styles.confirmButtonText}>
                    {t('common:next')}
                  </Typography.Button1>
                </LinearGradient>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default RevealRecoveryPhrase;
