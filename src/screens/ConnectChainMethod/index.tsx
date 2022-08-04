import React from 'react';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {useTranslation} from 'react-i18next';
import ConnectChainMethodButton from 'screens/ConnectChainMethod/components/ConnectChainMethodButton';
import Spacer from 'components/Spacer';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const ConnectChainMethod = () => {
  const {t} = useTranslation('connectChain');
  const styles = useStyles();
  const theme = useTheme();
  return (
    <DView style={styles.container} topBar={<TopBar />}>
      <Typography.H5 style={styles.textStyle}>
        {t('connectAddress')}
      </Typography.H5>
      <Typography.Body6 style={[styles.textStyle, styles.descriptionText]}>
        {t('selectMethodToConnect')}
      </Typography.Body6>

      <ConnectChainMethodButton method="ledger" handlePress={() => {}} />
      <Spacer paddingTop={theme.spacing.xl}>
        <ConnectChainMethodButton method="password" handlePress={() => {}} />
      </Spacer>
    </DView>
  );
};

export default ConnectChainMethod;
