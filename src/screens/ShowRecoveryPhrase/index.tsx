import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import MnemonicGrid from 'components/MnemonicGrid';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const ShowRecoveryPhrase: React.FC<Props> = props => {
  const {t} = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

  return (
    <DView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.H3 style={{marginBottom: theme.spacing.m}}>
        {t('settings:secret recovery phrase')}
      </Typography.H3>
      <Typography.Body6>
        <Trans
          i18nKey="settings:show recovery passphrase message"
          components={[
            <Typography.Subtitle2
              style={{color: theme.colors.desmosOrange01}}
            />,
            <Typography.Subtitle2 style={{color: theme.colors.black}} />,
          ]}
        />
      </Typography.Body6>
      <MnemonicGrid
        style={{marginTop: theme.spacing.l}}
        mnemonic="Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat Twirly Matrices Service Fat Twirly Matrices Service Fat Test Test"
      />
    </DView>
  );
};

export default ShowRecoveryPhrase;
