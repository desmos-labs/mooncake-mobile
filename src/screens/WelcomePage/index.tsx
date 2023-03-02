import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { modalSuccess } from 'assets/images';
import Button, {ButtonMode, ButtonSize} from 'components/Button';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import useNavigateToHome from 'hooks/navigation/useNavigateToHome';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

/**
 * Screen that is displayed to the user after signing up for a new account.
 * It contains the options to immediately back up their secret phrase
 * @constructor
 */
const WelcomePage: React.FC<Props> = () => {
  const { t } = useTranslation('common');
  const styles = useStyles();
  const theme = useTheme();

  const { navigate } = useNavigation<Props['navigation']>();
  const navigateHome = useNavigateToHome();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const navigateToHome = useCallback(() => {
    navigateHome();
  }, [navigateHome]);

  const navigateToBackupPhrase = useCallback(() => {
    // TODO: Implement this
    Alert.alert('Implement navigation to Back Up screen');
  }, []);

  const navigateToBackupPhraseExplanation = useCallback(() => {
    navigate(ROUTES.BOTTOM_MODAL, {
      title: t('welcomePage:why backup'),
      body: t('welcomePage:backup explanation'),
      primaryButtonLabel: t('common:i understand'),
      onPressPrimary: () => console.log('primary'),
    });
  }, [navigate, t]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView style={[styles.root]} topBar={<TopBar />}>
      <Image source={modalSuccess} style={styles.image} />
      <View style={styles.textContainer}>
        <Typography.H4>{t('congratulations')}</Typography.H4>
        <Typography.Body6>{t('dtag created')}</Typography.Body6>
      </View>
      <Button
        size={ButtonSize.M}
        additionalStyle={{marginBottom: theme.spacing.m}}
        mode={ButtonMode.CONTAINED}
        onPress={navigateToHome}>
        {t('welcome to', {product: 'Butter'})}
      </Button>
      <Button
        size={ButtonSize.M}
        mode={ButtonMode.OUTLINED}
        onPress={navigateToBackupPhrase}>
        {t('backup phrase')}
      </Button>
      <Button
        size={ButtonSize.M}
        mode={ButtonMode.TEXT}
        onPress={navigateToBackupPhraseExplanation}
        style={{marginTop: theme.spacing.m}}>
        {t('backup explanation')}
      </Button>
    </DView>
  );
};

export default WelcomePage;
