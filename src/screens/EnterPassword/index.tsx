import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {Formik} from 'formik';
import _ from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
import {LocalAccountAuthenticationArgs} from 'hooks/useUnlockWallet';
import {getLocalWallet, getMnemonic} from 'lib/SecureStorage';
import {StackScreenProps} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import {useNavigation, useRoute} from '@react-navigation/native';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import {AuthorizeWalletParamList} from 'navigation/RootNavigator/AuthorizeWalletStack';
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
  const {t} = useTranslation('enterPassword');
  const {goBack} = useNavigation<NavProps['navigation']>();
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

  const onFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues) => {
      const {password} = formValues;
      const useBiometrics = getMMKV<boolean>(
        MMKVKEYS.USE_BIOMETRICS,
      ) as boolean;

      if (address) {
        const wallet = await getLocalWallet(address, password, useBiometrics);

        if (!wallet) return;

        const mnemonic = await getMnemonic(address, password);

        if (wallet && onSuccessfulAuthentication) {
          onSuccessfulAuthentication({
            wallet: provideWallet ? wallet : undefined,
            mnemonic: provideMnemonic ? mnemonic : undefined,
            authorized: true,
          });
        }
      }

      onFailedAuthentication && onFailedAuthentication();
      goBack();
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
              <Button
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                onPress={handleSubmit}
                mode="contained">
                <Typography.Button1 style={styles.confirmButtonText}>
                  {t('common:confirm')}
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
