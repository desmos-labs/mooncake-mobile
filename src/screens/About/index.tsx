import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Linking, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import BackButton from 'components/BackButton';
import { useTheme } from 'native-base';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

type NavProps = NativeStackScreenProps<RootNavigatorParamList, ROUTES.ABOUT>;

/**
 * Screen that displays information about the app.
 */
const About: React.FC<NavProps> = ({ navigation }) => {
  const { t } = useTranslation('about');
  const styles = useStyles();
  const theme = useTheme();

  const openAboutDetails = React.useCallback(() => {
    navigation.navigate(ROUTES.ABOUT_DETAILS, {
      title: t('about mooncake'),
      message: t('about informations'),
    });
  }, [navigation, t]);

  return (
    <DView style={styles.root} disableHideKeyboardTouchable topBar={<TopBar />}>
      <Typography.Semibold24>{t('about', { ns: 'settings' })}</Typography.Semibold24>
      <Spacer paddingTop="m" />

      <TouchableOpacity style={styles.button} onPress={openAboutDetails}>
        <Typography.Subtitle2>{t('about mooncake', { ns: 'about' })}</Typography.Subtitle2>
        <BackButton
          style={{ transform: [{ rotate: '180deg' }] }}
          iconColor={theme.colors.surfaceBlack}
        />
      </TouchableOpacity>

      <Spacer paddingTop="m" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL('https://butter.social/privacy-policy')}>
        <Typography.Subtitle2>{t('privacy policy', { ns: 'legal' })}</Typography.Subtitle2>
        <BackButton
          style={{ transform: [{ rotate: '180deg' }] }}
          iconColor={theme.colors.surfaceBlack}
        />
      </TouchableOpacity>

      <Spacer paddingTop="m" />
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL('https://butter.social/terms-and-conditions')}>
        <Typography.Subtitle2>{t('terms of service', { ns: 'legal' })}</Typography.Subtitle2>
        <BackButton
          style={{ transform: [{ rotate: '180deg' }] }}
          iconColor={theme.colors.surfaceBlack}
        />
      </TouchableOpacity>
    </DView>
  );
};

export default About;
