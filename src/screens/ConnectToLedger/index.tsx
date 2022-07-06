import React from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native';
import DView from 'components/DView';
import DButton from 'components/DButton';
import Typography from 'components/Typography';
import {useRoute} from '@react-navigation/native';
import useConnectToLedger from 'hooks/ledger/useConnectToLedger';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useStyles from './useStyles';

export type ConnectToLedgerParams = {
  bleLedger: BleLedger;

  ledgerApp: LedgerApp;
};

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CONNECT_TO_LEDGER
>;

const ConnectToLedger = () => {
  const {
    params: {bleLedger, ledgerApp},
  } = useRoute<NavProps['route']>();
  const {t} = useTranslation();

  const styles = useStyles();
  const {connecting, connected, connectionError, transport, retry} =
    useConnectToLedger(bleLedger, ledgerApp);

  const status = connected ? t('connected') : t('error');
  const statusButton = connected ? t('next') : t('retry');

  const handleButtonPressed = React.useCallback(() => {
    console.log('connection success', transport, connectionError);

    if (connectionError) {
      retry();
    } else {
      // handle success
      // whole point of this screen is to get the transport object below, which
      // serves as the entry point to do ledger related things in code
      console.log('connection success', transport);
    }
  }, [connectionError, transport]);

  return (
    <DView>
      {connecting && <ActivityIndicator size="small" />}

      <Typography.Subtitle style={styles.status}>
        {connecting ? t('connecting') : status}
      </Typography.Subtitle>

      <Typography.Body style={styles.errorMessage}>
        {connectionError}
      </Typography.Body>

      <DButton
        mode="contained"
        onPress={handleButtonPressed}
        disabled={connecting}
        loading={connecting}>
        {connecting ? t('connecting') : statusButton}
      </DButton>
    </DView>
  );
};

export default ConnectToLedger;
