import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.BACKUP_PHRASE_BOTTOM_MODAL
>;

const BackupPhraseBottomModal = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('signup');
  const {goBack} = useNavigation<NavProps['navigation']>();

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={goBack}
      style={styles.container}>
      {/* dummy touchable opacity to prevent modal from getting dismissed if non-button */}
      {/* parts of the modal content are pressed */}
      <TouchableOpacity activeOpacity={1} style={styles.innerContainer}>
        <View style={styles.tabIcon} />
        <Typography.H4 style={styles.headerText}>
          {t('why backup')}
        </Typography.H4>
        <Spacer paddingVertical={40}>
          <Typography.Body5>{t('backup phrase text')}</Typography.Body5>
        </Spacer>
        <Button
          mode="contained"
          color={theme.colors.surfaceBlack}
          onPress={goBack}>
          <Typography.Button2 style={{color: theme.colors.white}}>
            {t('understand')}
          </Typography.Button2>
        </Button>
        <Spacer paddingVertical={theme.spacing.s} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default BackupPhraseBottomModal;
