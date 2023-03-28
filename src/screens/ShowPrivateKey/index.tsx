import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'native-base';
import DTextInput from 'components/DTextInput';
import useStyles from './useStyles';

export type ShowPrivateKeyScreenParams = {
  hexEncodedPrivateKey: string;
};

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_SHOW_PRIVATE_KEY>;

const ShowPrivateKey: React.FC<NavProps> = () => {
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation('settings');
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DView style={styles.root} topBar={<TopBar />} backgroundColor={theme.colors.white}>
      <Typography.H3 style={{ marginBottom: theme.spacing.m }}>{t('private key')}</Typography.H3>
      <Typography.Body6>{t('show private key message')}</Typography.Body6>
      <DTextInput multiline={true} editable={false} style={styles.input}>
        {params.hexEncodedPrivateKey}
      </DTextInput>
    </DView>
  );
};

export default ShowPrivateKey;
