import React from 'react';
import { LedgerApp } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import ROUTES from 'navigation/routes';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import PerformLedgerScan from 'screens/PerformLedgerScan';
import ConnectToLedger, { ConnectToLedgerParams } from 'screens/ConnectToLedger';

/**
 * Parameters that should be given to any screen within the stack that
 * allows to connect to a Ledger device.
 */
export interface ConnectToLedgerStackParams {
  readonly ledgerApp: LedgerApp;
  readonly onConnect: (transport: BluetoothTransport) => any;
  readonly onCancel?: () => any;
}

/**
 * List of parameters that each screen within the Ledger connection stack accepts.
 */
export type ConnectToLedgerStackParamList = {
  [ROUTES.PERFORM_LEDGER_SCAN]: ConnectToLedgerStackParams;
  [ROUTES.CONNECT_TO_LEDGER]: ConnectToLedgerParams;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CONNECT_TO_LEDGER_STACK>;

/**
 * Stack of screens that allow to connect to a Ledger device.
 */
const Stack = createStackNavigator<ConnectToLedgerStackParamList>();

/**
 * Stack that allow the user to connect to a Ledger device.
 */
const ConnectToLedgerStack = (props: NavProps) => {
  const { route } = props;
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.PERFORM_LEDGER_SCAN}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={ROUTES.PERFORM_LEDGER_SCAN}
        component={PerformLedgerScan}
        initialParams={route.params}
      />
      <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER} component={ConnectToLedger} />
    </Stack.Navigator>
  );
};
export default ConnectToLedgerStack;
