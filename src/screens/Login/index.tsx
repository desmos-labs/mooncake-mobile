import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import {butterflyLandingIcon, landingBG} from 'assets/images';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ToastConfig from 'config/ToastConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import useClearUserData from 'hooks/useClearUserData';
import {getPasswordWithBiometrics} from 'lib/SecureStorage';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilValue} from 'recoil';
import useLogin from 'services/axios/requests/Login/useLogin';
import useAutoLoginFromSignUp from 'screens/Login/useAutoLoginFromSignUp';
import ThemedLottieView from 'components/ThemedLottieView';
import {broadcastAnim} from 'assets/animations';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LOGIN>;

export type LoginParams = {
  // Callback to be executed if login is successful.
  onSuccess?: () => void;

  // Do not call pop() on successful login.
  noPop?: boolean;
};

const Login = () => {
  const styles = useStyles();
  const {t} = useTranslation('login');
  const theme = useTheme();
  const {activeAddress} = useActiveAccount();

  const {pop, getState, navigate} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();

  const toast = useToast();
  const {biometrics} = useRecoilValue(appSettingsState);
  const [loading, setLoading] = React.useState(false);
  const [biometricsLoading, setBiometricsLoading] = useState(false);
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {login} = useLogin();
  const clearUserData = useClearUserData();

  const {shouldAutoLogin} = useAutoLoginFromSignUp();

  const unlockWithBiometrics = React.useCallback(async () => {
    setBiometricsLoading(true);
    try {
      if (activeAddress) {
        const passwordToUse = await getPasswordWithBiometrics(activeAddress);
        const loginResponse = await login({
          activeAddress,
          password: passwordToUse,
          isDerivedPassword: true,
        });

        if (loginResponse) {
          if (!_.get(params, 'noPop')) {
            const {routes} = getState();
            if (routes.length > 1) {
              pop();
            } else {
              navigate(ROUTES.HOME_TABS, {
                screen: ROUTES.HOME_DISCOVER,
                params: {
                  type: 'discover',
                },
              });
            }
          }

          const onSuccessFn = _.get(params, 'onSuccess');
          onSuccessFn && onSuccessFn();
        } else {
          toast.show(t('toast:errorLogin'), {type: ToastConfig.ERROR_NO_RETRY});
        }
      } else {
        t('toast:errorSystemBusy', {type: ToastConfig.ERROR_NO_RETRY});
      }
    } catch (err) {
      // disable wrong password error if user cancels biometrics
      if (!String(err).includes('code: 13, msg: Cancel')) {
        setError(t('error:incorrectPassword'));
      }
    } finally {
      setBiometricsLoading(false);
    }
  }, [activeAddress, getState, login, params, toast]);

  useFocusEffect(
    React.useCallback(() => {
      if (biometrics) {
        unlockWithBiometrics();
      }
    }, [biometrics, unlockWithBiometrics]),
  );

  const handleSubmit = React.useCallback(async () => {
    if (!activeAddress) {
      return toast.show(
        t('toast:errorSystemBusy', {type: ToastConfig.ERROR_NO_RETRY}),
      );
    }
    try {
      setLoading(true);
      setError('');
      const loginResponse = await login({
        activeAddress,
        password,
      });

      if (!loginResponse) {
        toast.show(t('toast:errorLogin'), {type: ToastConfig.ERROR_NO_RETRY});
      } else {
        if (!_.get(params, 'noPop')) {
          const {routes} = getState();
          if (routes.length > 1) {
            pop();
          } else {
            navigate(ROUTES.HOME_TABS, {
              screen: ROUTES.HOME_DISCOVER,
              params: {
                type: 'discover',
              },
            });
          }
        }

        const onSuccessFn = _.get(params, 'onSuccess');
        onSuccessFn && onSuccessFn();
      }
    } catch (err: any) {
      setError(t('error:incorrectPassword'));
    } finally {
      setLoading(false);
    }
  }, [activeAddress, toast, login, password, params, getState]);

  if (shouldAutoLogin) {
    return (
      <DView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ThemedLottieView source={broadcastAnim} autoPlay autoSize loop />
      </DView>
    );
  }

  return (
    <DView
      showLoadingOverlay={biometricsLoading}
      statusBarProps={{translucent: true}}
      backgroundImage={landingBG}
      backgroundFillScreen
      style={styles.container}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
        behavior={Platform.OS === 'ios' ? 'position' : 'padding'}>
        <Image source={butterflyLandingIcon} style={styles.logo} />
        <Spacer paddingVertical={theme.spacing.s}>
          <Typography.Body1 style={styles.title}>
            {t('welcomeBack')}
          </Typography.Body1>
        </Spacer>
        <Typography.Body1 style={styles.subtitle}>
          {t('logBackIn')}
        </Typography.Body1>

        <View style={styles.contentContainer}>
          <Typography.Subtitle2 style={styles.labelStyle}>
            {t('password')}
          </Typography.Subtitle2>
          <DSecureTextInput
            autoFocus={!biometrics}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder={t('enterPassword')}
          />

          {error && (
            <Typography.Caption1 style={styles.errorStyle}>
              {error}
            </Typography.Caption1>
          )}

          <Spacer paddingTop={theme.spacing.m}>
            <Button
              color={theme.colors.white}
              disabled={loading || !password}
              loading={loading}
              style={{borderColor: theme.colors.white}}
              onPress={handleSubmit}
              mode="outlined">
              <Typography.Button2 style={{color: theme.colors.white}}>
                {t('common:confirm')}
              </Typography.Button2>
            </Button>
          </Spacer>
        </View>

        <View style={styles.bottomContentContainer}>
          <TouchableOpacity
            disabled={loading}
            style={styles.forgotPwButton}
            onPress={clearUserData}>
            <Typography.Button1 style={styles.labelStyle}>
              {t('forgotPassword')}
            </Typography.Button1>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </DView>
  );
};

export default Login;
