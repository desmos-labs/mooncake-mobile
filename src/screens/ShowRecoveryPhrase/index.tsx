import { useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import MnemonicGrid from 'components/MnemonicGrid';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

export type ShowSecretPhraseParams = {
  mnemonic: string;
};

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.SETTINGS_SHOW_SECRET_PHRASE
>;

const ShowRecoveryPhrase = () => {
  const { params } = useRoute<NavProps['route']>();
  const { pop } = useNavigation<NavProps['navigation']>();
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DView style={styles.root} topBar={<TopBar backButtonCustomBehavior={() => pop(2)} />}>
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
      <MnemonicGrid style={{ marginTop: theme.spacing.l }} mnemonic={params.mnemonic} />
    </DView>
  );
};

export default ShowRecoveryPhrase;
