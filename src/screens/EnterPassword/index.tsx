import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {Formik, FormikHelpers} from 'formik';
import {LocalAccountAuthenticationArgs} from 'hooks/useUnlockWallet';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {getLocalWallet, getMnemonic} from 'lib/SecureStorage';
import _ from 'lodash';
import {AuthorizeWalletParamList} from 'navigation/RootNavigator/AuthorizeWalletStack';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as Yup from 'yup';
import useStyles from './useStyles';

const initialFormValues = {
  password: '',
};

type NavProps = StackScreenProps<
  AuthorizeWalletParamList,
  ROUTES.AUTH_UNLOCK_LOCAL_WALLET
>;

/**
 * These optional params are for unlocking a specific wallet
 */
export type EnterPasswordParams = {
  address?: string;

  provideWallet?: boolean;

  provideMnemonic?: boolean;

  onSuccessfulAuthentication?: (result: LocalAccountAuthenticationArgs) => void;

  onFailedAuthentication?: () => void;
};

const EnterPassword = () => {
  const [loading, setLoading] = useState(false);
  const {t} = useTranslation('enterPassword');
  const {
    params: {
      address,
      provideWallet,
      onSuccessfulAuthentication,
      onFailedAuthentication,
      provideMnemonic,
    },
  } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const theme = useTheme();

  const onFormSubmit = React.useCallback(
    async (
      formValues: typeof initialFormValues,
      {setErrors}: FormikHelpers<any>,
    ) => {
      setLoading(true);
      const {password} = formValues;

      const useBiometrics = getMMKV<boolean>(
        MMKVKEYS.USE_BIOMETRICS,
      ) as boolean;

      if (address) {
        try {
          const wallet = await getLocalWallet(address, password, useBiometrics);

          if (!wallet) throw new Error('Error unlocking wallet');

          const mnemonic = await getMnemonic(address, password);

          if (wallet && onSuccessfulAuthentication) {
            onSuccessfulAuthentication({
              wallet: provideWallet ? wallet : undefined,
              mnemonic: provideMnemonic ? mnemonic : undefined,
              authorized: true,
            });
          }
        } catch (err) {
          setLoading(false);
          onFailedAuthentication && onFailedAuthentication();
          setErrors({password: t('error:incorrectPassword')});
        } finally {
          setLoading(false);
        }
      }
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
    <DView style={styles.container} topBar={<TopBar />}>
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
                color={theme.colors.surfaceBlack}
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
