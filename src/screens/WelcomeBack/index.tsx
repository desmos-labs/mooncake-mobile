import DView from 'components/DView';
import React from 'react';
import {dummyAvatar, landingBG} from 'assets/images';
import {Image, View} from 'react-native';
import Typography from 'components/Typography';
import {useTheme} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import useStyles from './useStyles';

const WelcomeBack = () => {
  const theme = useTheme();
  const {t} = useTranslation('welcomeBack');

  const styles = useStyles();

  const [password, setPassword] = React.useState('');

  return (
    <DView
      statusBarProps={{translucent: true}}
      background={landingBG}
      style={styles.container}>
      <Image source={dummyAvatar} style={styles.dummyAvatar} />

      <Typography.H4 style={styles.headerStyle}>{t('header')}</Typography.H4>

      <Typography.Body6 style={styles.descriptionStyle}>
        {t('description')}
      </Typography.Body6>

      <View style={{alignSelf: 'stretch'}}>
        <Typography.Subtitle2 style={{color: theme.colors.white}}>
          {t('inputLabel')}
        </Typography.Subtitle2>

        <DSecureTextInput
          placeholder={t('inputPlaceholder')}
          value={password}
          onChangeText={setPassword}
        />

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            style={{borderColor: theme.colors.white}}
            labelStyle={{color: theme.colors.white}}
            mode="outlined">
            {t('common:confirm')}
          </Button>
        </Spacer>
      </View>

      <View style={styles.forgotPwGroup}>
        <Button
          mode="text"
          labelStyle={{color: theme.colors.white, textAlign: 'center'}}>
          {t('forgotPw')}
        </Button>
      </View>
    </DView>
  );
};

export default WelcomeBack;
