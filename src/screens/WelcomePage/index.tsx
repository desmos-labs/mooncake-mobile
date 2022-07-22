import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const WelcomePage: React.FC<Props> = props => {
  const {t} = useTranslation('common');
  const styles = useStyles();
  const theme = useTheme();

  const navigateToHome = useCallback(() => {
    console.log('navToHome');
  }, []);

  const navigateToBackupPhrase = useCallback(() => {
    console.log('navToBackup');
  }, []);

  return (
    <DView style={[styles.root]} topBar={<TopBar stackProps={props} />}>
      <Image source={modalSuccess} style={styles.image} />
      <View style={styles.textContainer}>
        <Typography.H4>{t('congratulations')}</Typography.H4>
        <Typography.Body6>{t('dtag created')}</Typography.Body6>
      </View>
      <Button
        containerStyle={{marginBottom: theme.spacing.m}}
        mode="gradientFilled"
        onPress={navigateToHome}>
        <Typography.Button2 style={{color: theme.colors.white}}>
          {t('welcome to', {product: '[Product]'})}
        </Typography.Button2>
      </Button>
      <Button mode="outlined" onPress={navigateToBackupPhrase}>
        <Typography.Button2 style={{color: theme.colors.desmosOrange01}}>
          {t('backup phrase')}
        </Typography.Button2>
      </Button>
      <Button
        mode="text"
        onPress={() => console.log('press')}
        style={{marginTop: theme.spacing.m}}>
        <Typography.Subtitle4>{t('backup explanation')}</Typography.Subtitle4>
      </Button>
    </DView>
  );
};

export default WelcomePage;
