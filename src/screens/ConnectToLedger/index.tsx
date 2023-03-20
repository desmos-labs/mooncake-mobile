import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Button, { ButtonMode, ButtonSize } from 'components/Button';
import { BLELedger, LedgerApp } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import ROUTES from 'navigation/routes';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import { Image } from 'react-native';
import { errorImage, modalSuccess } from 'assets/images';
import DView from 'components/DView';
import { pairDevicesAnim } from 'assets/animations';
import { useTheme } from 'native-base';
import useConnectToLedger from './hooks';
import useStyles from './useStyles';

export interface ConnectToLedgerParams {
  readonly bleLedger: BLELedger;
  readonly ledgerApp: LedgerApp;
  readonly onConnect: (transport: BluetoothTransport) => any;
}

export type Props = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.CONNECT_TO_LEDGER>;

/**
 * Screen that performs a Bluetooth scan in order to find a Ledger device.
 */
const ConnectToLedger = (props: Props) => {
  const { t } = useTranslation('connectToLedger');
  const styles = useStyles();
  const theme = useTheme();
  const { navigation, route } = props;
  const { bleLedger, ledgerApp, onConnect } = route.params;
  const { connecting, connected, connectionError, transport, retry } = useConnectToLedger(
    bleLedger,
    ledgerApp,
  );

  const status = connected ? t('connected') : t('sorryConnectionFailed');
  const statusButton = connected ? t('common:next') : t('common:retry');
  const statusImage = connected ? (
    <Image style={styles.image} source={modalSuccess} />
  ) : (
    <Image style={styles.image} source={errorImage} />
  );

  useEffect(() => {
    if (connected) {
      onConnect(transport!);
    }
  }, [connected, transport, onConnect, navigation]);

  const onButtonPressed = useCallback(() => {
    if (connected) {
      onConnect(transport!);
    } else {
      retry();
    }
  }, [connected, onConnect, retry, transport]);

  return (
    <DView topBar={<TopBar />}>
      {connecting ? (
        <ThemedLottieView
          style={styles.animation}
          source={pairDevicesAnim}
          autoPlay
          loop
          autoSize
        />
      ) : (
        statusImage
      )}

      <Typography.Subtitle1 style={styles.status}>
        {connecting ? t('connecting') : status}
      </Typography.Subtitle1>

      <Typography.Body1 style={styles.errorMessage}>{connectionError}</Typography.Body1>

      <Button
        size={ButtonSize.M}
        textColor={theme.colors.white}
        backgroundColor={theme.colors.surfaceBlack}
        mode={ButtonMode.CONTAINED}
        onPress={onButtonPressed}
        disabled={connecting}
        loading={connecting}>
        {connecting ? t('connecting') : statusButton}
      </Button>
    </DView>
  );
};

export default ConnectToLedger;
