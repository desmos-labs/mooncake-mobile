import React from 'react';
import {butterflyLandingIcon, landingBG} from 'assets/images';
import {Image, TouchableOpacity, View} from 'react-native';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import DSecureTextInput from 'components/DSecureTextInput';
import Button from 'components/Button';
import useLogin from 'services/axios/requests/Login/useLogin';
import useActiveAccount from 'hooks/useActiveAccount';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import _ from 'lodash';
import useClearUserData from 'hooks/useClearUserData';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.LOGIN>;

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

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [password, setPassword] = React.useState('');
  const {login} = useLogin();
  const clearUserData = useClearUserData();

  const handleSubmit = React.useCallback(async () => {
    if (!activeAddress) {
      return toast.show(
        t('toast:errorSystemBusy', {type: ToastConfig.ERROR_NO_RETRY}),
      );
    }
    try {
      setLoading(true);
      setError('');
      const loginResponse = await login(activeAddress, password);

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
  }, [password, activeAddress]);

  return (
    <DView
      statusBarProps={{translucent: true}}
      backgroundImage={landingBG}
      backgroundFillScreen
      style={styles.container}>
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
    </DView>
  );
};

export default Login;
