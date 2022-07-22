import {StackScreenProps} from '@react-navigation/stack';
import {modalSuccess} from 'assets/images';
import Button from 'components/Button';
import DView from 'components/DView';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const BackupSuccessful: React.FC<Props> = () => {
  const {t} = useTranslation('welcomePage');
  const styles = useStyles();
  const theme = useTheme();

  const navigateToHome = useCallback(() => {
    console.log('navToHome');
  }, []);

  return (
    <DView style={styles.root}>
      <Image source={modalSuccess} style={styles.image} />
      <View style={styles.textContainer}>
        <Typography.H4>{t('you are all set')}</Typography.H4>
        <Typography.Body6
          style={{marginTop: theme.spacing.s, textAlign: 'center'}}>
          {t('backup warning')}
        </Typography.Body6>
      </View>
      <Button
        containerStyle={{marginTop: theme.spacing.l}}
        mode="gradientFilled"
        onPress={navigateToHome}>
        <Typography.Button2 style={{color: theme.colors.white}}>
          {t('ok, got it')}
        </Typography.Button2>
      </Button>
    </DView>
  );
};

export default BackupSuccessful;
