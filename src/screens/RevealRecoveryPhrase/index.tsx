import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as Yup from 'yup';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_REVEAL_SECRET_PHRASE
>;

const RevealRecoveryPhrase: React.FC<NavProps> = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

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
    <DView style={styles.root} topBar={<TopBar />}>
      <Typography.H3>{t('settings:reveal secret phrase')}</Typography.H3>
      <Typography.Body6 style={styles.bodyText}>
        <Trans
          i18nKey="settings:secret recovery passphrase message"
          components={[
            <Typography.Subtitle2 style={{color: theme.colors.surfaceBlack}} />,
          ]}
        />
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
              clearTextOnFocus={true}
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
              keyboardVerticalOffset={Platform.OS === 'ios' ? 370 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <Button
                mode="gradientFilled"
                onPress={handleSubmit}
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                style={styles.button}
                containerStyle={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                    ? styles.disabled
                    : null
                }>
                <Typography.Button1 style={styles.confirmButtonText}>
                  {t('common:next')}
                </Typography.Button1>
              </Button>
            </KeyboardAvoidingView>
          </View>
        )}
      </Formik>
    </DView>
  );
};

export default RevealRecoveryPhrase;
