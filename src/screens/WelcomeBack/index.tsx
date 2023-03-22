import { butterflyLandingIcon, landingBG } from 'assets/images';
import Button from 'components/CustomButton';
import DSecureTextInput from 'components/DSecureTextInput';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Box, Text, useTheme } from 'native-base';
import useStyles from './useStyles';

/**
 * Screen that is shown to the user when they come back to the application.
 * @constructor
 */
const WelcomeBack = () => {
  const theme = useTheme();
  const { t } = useTranslation('welcomeBack');
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
      <Box alignSelf="stretch">
        <Typography.Subtitle2 style={styles.inputLabel}>{t('inputLabel')}</Typography.Subtitle2>

        <DSecureTextInput
          placeholder={t('inputPlaceholder')}
          value={password}
          onChangeText={setPassword}
        />

        <Spacer paddingVertical={theme.spacing.l}>
          <Button
            size={44}
            textColor={theme.colors.white}
            borderColor={theme.colors.white}
            variant="outlined">
            {t('common:confirm')}
          </Button>
        </Spacer>
      </Box>

      <View style={styles.forgotPwGroup}>
        <Button variant="link" size={44} textColor={theme.colors.white}>
          {t('forgotPw')}
        </Button>
      </View>
    </DView>
  );
};

export default WelcomeBack;
