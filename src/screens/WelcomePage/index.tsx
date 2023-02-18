import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { modalSuccess } from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

/**
 * Screen that is displayed to the user after signing up for a new account.
 * It contains the options to immediately back-up their secret phrase
 * @constructor
 */
const WelcomePage: React.FC<Props> = () => {
  const { t } = useTranslation('common');
  const { navigate } = useNavigation<Props['navigation']>();
  const styles = useStyles();
  const theme = useTheme();

  const navigateToHome = useCallback(() => {
    console.log('navToHome');
  }, []);

  const navigateToBackupPhrase = useCallback(() => {
    console.log('navToBackup');
  }, []);

  const navigateToBackupPhraseExplanation = useCallback(() => {
    navigate({
      name: ROUTES.BOTTOM_MODAL,
      params: {
        title: t('welcomePage:why backup'),
        body: t('welcomePage:backup explanation'),
        primaryButtonLabel: t('common:i understand'),
        onPressPrimary: () => console.log('primary'),
      },
    });
  }, []);

  return (
    <DView style={[styles.root]} topBar={<TopBar />}>
      <Image source={modalSuccess} style={styles.image} />
      <View style={styles.textContainer}>
        <Typography.H4>{t('congratulations')}</Typography.H4>
        <Typography.Body6>{t('dtag created')}</Typography.Body6>
      </View>
      <Button
        containerStyle={{ marginBottom: theme.spacing.m }}
        mode="gradientFilled"
        onPress={navigateToHome}>
        <Typography.Button2 style={{ color: theme.colors.white }}>
          {t('welcome to', { product: 'Butter' })}
        </Typography.Button2>
      </Button>
      <Button mode="outlined" onPress={navigateToBackupPhrase}>
        <Typography.Button2 style={{ color: theme.colors.butterOrange01 }}>
          {t('backup phrase')}
        </Typography.Button2>
      </Button>
      <Button
        mode="text"
        onPress={navigateToBackupPhraseExplanation}
        style={{ marginTop: theme.spacing.m }}>
        <Typography.Subtitle4>{t('backup explanation')}</Typography.Subtitle4>
      </Button>
    </DView>
  );
};

export default WelcomePage;
