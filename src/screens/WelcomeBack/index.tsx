import {butterflyLandingIcon, landingBG} from 'assets/images';
import Button from 'components/Button';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const WelcomeBack = () => {
  const theme = useTheme();
  const {t} = useTranslation('welcomeBack');

  const styles = useStyles();

  const [password, setPassword] = React.useState('');

  return (
    <DView backgroundImage={landingBG} style={styles.container}>
      <Image source={butterflyLandingIcon} style={styles.dummyAvatar} />
      <Text style={styles.title} allowFontScaling>
        {t('header')}
      </Text>
      <Text style={styles.subtitle} allowFontScaling>
        {t('description')}
      </Text>
      <Spacer paddingVertical={20} />
      <View style={{alignSelf: 'stretch'}}>
        <Typography.Subtitle2
          style={{color: theme.colors.white, marginBottom: 6}}>
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
