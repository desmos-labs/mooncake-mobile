import { LedgerConnector } from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import React, { useCallback, useEffect, useState } from 'react';
import { BLELedger, LedgerApp } from 'types/ledger';
import { err, ok, ResultAsync } from 'neverthrow';
import {
  convertErrorToLedgerError,
  isNoApplicationOpenedError,
  isWrongApplicationError,
} from 'lib/LedgerUtils/errors';
import { closeApp, openApp, openLedgerTransport } from 'lib/LedgerUtils/commands';

/**
 * Hook that provides a function to connect to a Ledger device.
 * @param ledger - The Ledger device to connect to.
 * @param ledgerApp - The app that the Ledger device should have opened.
 */
export function useConnectToLedger(ledger: BLELedger, ledgerApp: LedgerApp) {
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const ledgerConnect = React.useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      const openTransportResult = await openLedgerTransport(ledgerToConnect.id);

      if (openTransportResult.isErr()) {
        return err(openTransportResult.error);
      }
      const openedTransport = openTransportResult.value;
      const launchpad = new LedgerConnector(openedTransport, {
        ledgerAppName: ledgerAppToUse.name,
      });

      const appVersionResult = await ResultAsync.fromPromise(launchpad.getCosmosAppVersion(), e =>
        convertErrorToLedgerError(e, 'Failed to communicate with the Ledger'),
      );

      if (appVersionResult.isErr()) {
        if (isNoApplicationOpenedError(appVersionResult.error)) {
          // Request to open the expected application
          const expectedApp = appVersionResult.error.expectedAppName;
          return openApp(openedTransport, expectedApp);
        } else if (isWrongApplicationError(appVersionResult.error)) {
          // Request to close the current application.
          const closeAppResult = await closeApp(openedTransport);
          if (closeAppResult.isErr()) {
            return closeAppResult;
          }

          // Request to open the expected application
          return openApp(closeAppResult.value, appVersionResult.error.expectedAppName);
        } else {
          return err(appVersionResult.error);
        }
      }

      return ok(openedTransport);
    },
    [],
  );

  const connectToLedger = useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      setConnecting(true);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      const connectResult = await ledgerConnect(ledgerToConnect, ledgerAppToUse);

      if (connectResult.isErr()) {
        setConnectionError(connectResult.error.message);
      } else {
        setTransport(connectResult.value);
        setConnected(true);
      }
      setConnecting(false);
    },
    [ledgerConnect],
  );

  const retry = useCallback(() => {
    return connectToLedger(ledger, ledgerApp);
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
  };
}
