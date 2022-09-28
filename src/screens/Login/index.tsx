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
import useStyles from './useStyles';

const Login = () => {
  const styles = useStyles();
  const {t} = useTranslation('login');
  const theme = useTheme();

  return (
    <DView
      statusBarProps={{translucent: true}}
      background={landingBG}
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
        <DSecureTextInput placeholder={t('enterPassword')} />

        <Spacer paddingTop={theme.spacing.m}>
          <Button
            style={{borderColor: theme.colors.white}}
            onPress={() => {}}
            mode="outlined">
            <Typography.Button2 style={{color: theme.colors.white}}>
              {t('common:confirm')}
            </Typography.Button2>
          </Button>
        </Spacer>
      </View>
      <View style={styles.bottomContentContainer}>
        <TouchableOpacity style={styles.forgotPwButton}>
          <Typography.Button1 style={styles.labelStyle}>
            {t('forgotPassword')}
          </Typography.Button1>
        </TouchableOpacity>
      </View>
    </DView>
  );
};

export default Login;
