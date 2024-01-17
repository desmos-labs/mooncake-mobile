import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DTextInput from 'components/DTextInput';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
      <Typography.Semibold24 style={{ marginBottom: theme.spacing.m }}>
        {t('private key')}
      </Typography.Semibold24>
      <Typography.Regular14>{t('show private key message')}</Typography.Regular14>
      <DTextInput multiline={true} editable={false} style={styles.input}>
        {params.hexEncodedPrivateKey}
      </DTextInput>
    </DView>
  );
};

export default ShowPrivateKey;
