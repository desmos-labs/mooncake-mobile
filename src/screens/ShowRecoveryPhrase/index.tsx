import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import MnemonicGrid from 'components/MnemonicGrid';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import React from 'react';
import {useTranslation} from 'react-i18next';
import useStyles from './useStyles';

declare type Props = StackScreenProps<RootNavigatorParamList>;

const ShowRecoveryPhrase: React.FC<Props> = props => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <DView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.H3 style={{marginBottom: 16}}>
        {t('settings:secret recovery phrase')}
      </Typography.H3>
      <Typography.Body6>
        {t('settings:show recovery passphrase message')}
      </Typography.Body6>
      <MnemonicGrid
        style={{marginTop: 32}}
        mnemonic="Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat Dentists Twirly Matrices Service Fat Twirly Matrices Service Fat Twirly Matrices Service Fat Test Test"
      />
    </DView>
  );
};

export default ShowRecoveryPhrase;
