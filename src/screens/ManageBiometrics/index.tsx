import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik, FormikHelpers} from 'formik';
import useActiveAccount from 'hooks/useActiveAccount';
import {getLocalWallet, setBiometricData} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import {AppSettings} from 'types/settings';
import * as Yup from 'yup';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.MANAGE_BIOMETRICS
>;

const initialFormValues = {
  password: '',
};

const ManageBiometrics = () => {
  const {activeAddress} = useActiveAccount();
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation('enterPassword');
  const {goBack} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();
  const theme = useTheme();

  const onFormSubmit = React.useCallback(
    async (
      formValues: typeof initialFormValues,
      {setErrors}: FormikHelpers<typeof formValues>,
    ) => {
      setLoading(true);
      const {password} = formValues;

      try {
        if (activeAddress) {
          const wallet = await getLocalWallet(activeAddress, password);
          if (wallet) {
            const result = await setBiometricData(password, password);
            if (result) {
              setSettings((oldState: AppSettings) => {
                return {
                  ...oldState,
                  biometrics: !settings.biometrics,
                };
              });
              goBack();
            } else {
              setErrors({password: t('error:incorrectPassword')});
            }
          } else {
            setErrors({password: t('error:incorrectPassword')});
          }
        } else {
          throw new Error('address is empty'); // instead of do nothing
        }
      } catch (err) {
        // onFailedAuthentication && onFailedAuthentication();
        // Add other error case handlers here
        if (String(err).includes('Malformed UTF-8 data')) {
          setErrors({password: t('error:incorrectPassword')});
        } else {
          setErrors({password: t('error:incorrectPassword')});
        }
        console.log(String(err));
      } finally {
        setLoading(false);
      }
    },
    [activeAddress, goBack, setSettings, settings],
  );

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, []);

  return (
    <DView
      style={styles.container}
      backgroundColor={theme.colors.white}
      topBar={<TopBar />}>
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
              style={styles.textInput}
              autoFocus={true}
              placeholder={t('inputPlaceholder')}
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
              keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <Button
                loading={loading}
                color={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                    ? theme.colors.lightGrey02
                    : theme.colors.surfaceBlack
                }
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                onPress={handleSubmit}
                mode="contained">
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

export default ManageBiometrics;
