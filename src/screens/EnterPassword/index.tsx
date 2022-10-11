import {
  CompositeScreenProps,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import React, {ComponentProps, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import * as Yup from 'yup';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {MNEMONIC_INPUT_MODE} from 'screens/MnemonicInput';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  StackScreenProps<AuthorizeWalletParamList, ROUTES.AUTH_UNLOCK_LOCAL_WALLET>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * `These optional params are for unlocking a specific wallet
 * @property {string} address - The address of the account to authenticate.
 * @property {boolean} provideWallet - If true, wallet will be return on successful authentication.
 * @property {boolean} provideMnemonic - If true, mnemonic will be return on successful authentication.
 * @property {string} titleLabelOverride - The title of the screen.
 * @property {string} confirmButtonLabelOverride - The label of the button that will be used to confirm the input.
 * @property dViewProps - This is the props that will be passed to the DView component.
 * @property onSuccessfulAuthentication - A callback function that is called when the user successfully
 * enters the password.
 * @property onFailedAuthentication - A callback function that is called when the user fails to
 * authenticate.
 */
export type EnterPasswordParams = {
  address?: string;
  provideWallet?: boolean;
  provideMnemonic?: boolean;
  titleLabelOverride?: string;
  buttonLabelOverride?: string;
  inputLabelOverride?: string;
  dViewProps?: ComponentProps<typeof DView>;
  onSuccessfulAuthentication?: (result: LocalAccountAuthenticationArgs) => void;
  onFailedAuthentication?: () => void;
};

const initialFormValues = {
  password: '',
};

const EnterPassword = () => {
  const [loading, setLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const {t} = useTranslation('enterPassword');
  const {
    params: {
      address,
      provideWallet,
      provideMnemonic,
      titleLabelOverride,
      buttonLabelOverride,
      dViewProps,
      onSuccessfulAuthentication,
      onFailedAuthentication,
      inputLabelOverride,
    },
  } = useRoute<NavProps['route']>();
  const {goBack, replace} = useNavigation<NavProps['navigation']>();

  const styles = useStyles();
  const theme = useTheme();

  // Fail the authentication request if the screen is unmounted (i.e user presses back)
  // the resolved state will ensure that this is only run if the unlock promise has not been resolved
  React.useEffect(() => {
    return () => {
      if (!resolved) {
        onFailedAuthentication && onFailedAuthentication();
      }
    };
  }, [resolved]);

  const onFormSubmit = React.useCallback(
    async (
      formValues: typeof initialFormValues,
      {setErrors}: FormikHelpers<typeof formValues>,
    ) => {
      setLoading(true);
      const {password} = formValues;

      const useBiometrics = getMMKV<boolean>(
        MMKVKEYS.USE_BIOMETRICS,
      ) as boolean;

      try {
        if (address) {
          const wallet = await getLocalWallet(address, password, useBiometrics);

          if (!wallet) throw new Error('Error unlocking wallet');

          const mnemonic = await getMnemonic(address, password);

          if (wallet && onSuccessfulAuthentication) {
            setResolved(true);
            onSuccessfulAuthentication({
              wallet: provideWallet ? wallet : undefined,
              mnemonic: provideMnemonic ? mnemonic : undefined,
              authorized: true,
              password,
            });
            goBack();
          } else {
            onFailedAuthentication && onFailedAuthentication();
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
    [
      address,
      provideWallet,
      provideMnemonic,
      onSuccessfulAuthentication,
      // onFailedAuthentication,
    ],
  );

  const onPressForgotPassword = React.useCallback(() => {
    // possible memory leak as the unlock promise will never get resolved this way
    replace(ROUTES.MNEMONIC_INPUT, {
      mode: MNEMONIC_INPUT_MODE.RESET_PASSWORD,
    });
  }, []);

  const validationSchema = React.useMemo(() => {
    return Yup.object().shape({
      password: Yup.string().required(t('error:required')),
    });
  }, []);

  return (
    <DView
      style={styles.container}
      backgroundColor={theme.colors.white}
      topBar={<TopBar />}
      {...dViewProps}>
      <Typography.H3 style={styles.headerText}>
        {titleLabelOverride || t('header')}
      </Typography.H3>

      <Formik
        initialValues={initialFormValues}
        onSubmit={onFormSubmit}
        validationSchema={validationSchema}>
        {({handleSubmit, errors, setValues, values}) => (
          <View style={styles.formContainer}>
            <Typography.Subtitle2 style={styles.inputLabel}>
              {inputLabelOverride || t('inputLabel')}
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
                color={theme.colors.surfaceBlack}
                disabled={
                  !values.password ||
                  _.flatten(Object.values(errors)).length > 0
                }
                onPress={handleSubmit}
                mode="contained">
                <Typography.Button1 style={styles.confirmButtonText}>
                  {buttonLabelOverride || t('common:next')}
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
