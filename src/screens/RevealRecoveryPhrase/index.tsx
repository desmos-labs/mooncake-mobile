import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { Formik, FormikHelpers } from 'formik';
import useActiveAccount from 'hooks/useActiveAccount';
import { getLocalWallet, getMnemonic, getPasswordWithBiometrics } from 'lib/SecureStorage';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRecoilValue } from 'recoil';
import * as Yup from 'yup';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_REVEAL_SECRET_PHRASE>;

const RevealRecoveryPhrase: React.FC<NavProps> = () => {
  const { biometrics } = useRecoilValue(appSettingsState);
  const [loading, setLoading] = useState(false);
  const [biometricsLoading, setBiometricsLoading] = useState(false);
  const { activeAddress } = useActiveAccount();
  const navigation = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

  const initialFormValues = {
    password: '',
  };

  const unlockWithBiometrics = React.useCallback(async () => {
    setBiometricsLoading(true);
    try {
      if (activeAddress) {
        const password = await getPasswordWithBiometrics(activeAddress);
        const wallet = await getLocalWallet(activeAddress, password, true);
        const mnemonic = await getMnemonic(activeAddress, password, true);

        if (wallet) {
          navigation.navigate(ROUTES.SETTINGS_SHOW_SECRET_PHRASE, {
            mnemonic: mnemonic!,
          });
        } else {
          console.error('Errors while unlocking wallet');
        }
      } else {
        console.error('Invalid address');
      }
    } catch (err) {
      console.log(String(err));
    } finally {
      setBiometricsLoading(false);
    }
  }, [activeAddress]);

  const onFormSubmit = React.useCallback(
    async (formValues: typeof initialFormValues, { setErrors }: FormikHelpers<any>) => {
      setLoading(true);
      const { password } = formValues;

      if (activeAddress) {
        try {
          const wallet = await getLocalWallet(activeAddress, password);
          if (!wallet) setErrors({ password: t('error:walletError') });
          const mnemonic = await getMnemonic(activeAddress, password);

          if (wallet) {
            navigation.navigate(ROUTES.SETTINGS_SHOW_SECRET_PHRASE, {
              mnemonic: mnemonic!,
            });
          }
        } catch (err) {
          setErrors({ password: t('error:incorrectPassword') });
        } finally {
          setLoading(false);
        }
      }
    },
    [activeAddress],
  );

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (biometrics) {
        unlockWithBiometrics();
      }
    }, [biometrics, unlockWithBiometrics]),
  );

  return (
    <DView style={styles.root} topBar={<TopBar />} showLoadingOverlay={biometricsLoading}>
      <Typography.H3>{t('settings:reveal secret phrase')}</Typography.H3>
      <Typography.Body6 style={styles.bodyText}>{t('settings:firstRow')}</Typography.Body6>
      <Typography.Body6 style={{ marginTop: theme.spacing.l }}>
        <Trans
          i18nKey="settings:secondRow"
          components={[<Typography.Subtitle2 style={{ color: theme.colors.surfaceBlack }} />]}
        />
      </Typography.Body6>
      <Typography.Body6 style={{ marginTop: theme.spacing.l, marginBottom: theme.spacing.xl }}>
        {t('settings:thirdRow')}
      </Typography.Body6>
      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({ handleSubmit, errors, setValues, values }) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {t('settings:enter password to continue')}
            </Typography.Subtitle2>
            <DSecureTextInput
              autoFocus={!biometrics}
              clearTextOnFocus={true}
              placeholder={t('enterPassword:inputPlaceholder')}
              value={values.password}
              onChangeText={(text: string) => {
                setValues({ password: text }, true);
              }}
              error={!!errors.password}
            />
            {errors.password && (
              <Typography.Caption1 style={styles.errorText}>{errors.password}</Typography.Caption1>
            )}

            <KeyboardAvoidingView
              keyboardVerticalOffset={Platform.OS === 'ios' ? 415 : 0}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.buttonGroup}>
              <Button
                color={theme.colors.surfaceBlack}
                loading={loading}
                mode="contained"
                onPress={handleSubmit}
                disabled={!values.password || _.flatten(Object.values(errors)).length > 0}
                style={styles.button}
                containerStyle={
                  !values.password || _.flatten(Object.values(errors)).length > 0
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
