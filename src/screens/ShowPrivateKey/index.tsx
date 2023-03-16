import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from 'native-base';
import DTextInput from 'components/DTextInput';
import useStyles from './useStyles';

export type ShowPrivateKeyScreenParams = {
  hexEncodedPrivateKey: string;
};

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SETTINGS_SHOW_PRIVATE_KEY>;

const ShowPrivateKey: React.FC<NavProps> = () => {
  const { params } = useRoute<NavProps['route']>();
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DView style={styles.root} topBar={<TopBar />}>
      <Typography.H3 style={{ marginBottom: theme.spacing.m }}>
        {t('settings:secret recovery phrase')}
      </Typography.H3>
      <Typography.Body6>
        <Trans
          i18nKey="settings:show recovery passphrase message"
          components={[
            <Typography.Subtitle2 style={{ color: theme.colors.butterOrange01 }} />,
            <Typography.Subtitle2 style={{ color: theme.colors.surfaceBlack }} />,
          ]}
        />
      </Typography.Body6>
      <DTextInput multiline={true} editable={false}>
        {params.hexEncodedPrivateKey}
      </DTextInput>
    </DView>
  );
};

export default ShowPrivateKey;
