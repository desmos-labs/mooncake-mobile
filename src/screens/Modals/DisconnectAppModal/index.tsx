import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { desmosIcon, disconnectIcon } from 'assets/images';
import Button, { ButtonMode } from 'components/Button';
import Typography from 'components/Typography';
import GetAppIcon from 'lib/GetAppIcon';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { useTheme } from 'native-base';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DISCONNECT_APP_MODAL>;

export type DisconnectAppParams = {
  appName: string;
  onConfirmDisconnection: () => Promise<void>;
};

const DisconnectAppModal = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { goBack } = useNavigation<NavProps['navigation']>();

  const {
    params: { appName, onConfirmDisconnection },
  } = useRoute<NavProps['route']>();

  const { t } = useTranslation('disconnectApp');

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.chainImageGroup}>
          <Image source={GetAppIcon(appName)} style={styles.chainIcon} />
          <Image source={disconnectIcon} style={styles.disconnectIcon} />
          <Image source={desmosIcon} style={styles.chainIcon} />
        </View>
        <Typography.H5 style={styles.textStyle}>{t('disconnect')}</Typography.H5>

        <Typography.Body5 style={styles.textStyle}>{t('areYouSure', { appName })}</Typography.Body5>

        <Button
          size={44}
          additionalStyle={styles.confirmButton}
          mode={ButtonMode.CONTAINED}
          backgroundColor={theme.colors.surfaceBlack}
          onPress={onConfirmDisconnection}>
          {t('common:yes')}
        </Button>

        <Button size={44} mode={ButtonMode.OUTLINED} onPress={goBack}>
          <Typography.Button1>{t('common:no')}</Typography.Button1>
        </Button>
      </View>
    </View>
  );
};

export default DisconnectAppModal;
