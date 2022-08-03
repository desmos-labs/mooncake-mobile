import {LaunchpadLedger} from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {useCallback, useEffect, useState} from 'react';

export default function useConnectToLedger(
  ledger: BleLedger,
  ledgerApp: LedgerApp,
) {
  const [paired, setPaired] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const connectToLedger = useCallback(
    async (ledgerToConnect: BleLedger, ledgerAppToUse: LedgerApp) => {
      setPaired(false);
      setConnecting(true);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      try {
        const transportToUse: BluetoothTransport =
          await BluetoothTransport.open(ledgerToConnect.id);

        setPaired(true);
        const launchpad = new LaunchpadLedger(transportToUse, {
          ledgerAppName: ledgerAppToUse.name,
        });
        await launchpad.getCosmosAppVersion().catch(async ex => {
          await transportToUse.close();
          throw ex;
        });
        setTransport(transportToUse);
        setConnected(true);
      } catch (e: any) {
        setConnectionError(e.toString());
      }

      setConnecting(false);
    },
    [],
  );

  const retry = useCallback(() => {
    connectToLedger(ledger, ledgerApp);
  }, [connectToLedger, ledger, ledgerApp]);

  useEffect(() => {
    connectToLedger(ledger, ledgerApp);
  }, [connectToLedger, ledger, ledgerApp]);

  return {
    connecting,
    connected,
    transport,
    connectionError,
    retry,
    paired,
  };
}
