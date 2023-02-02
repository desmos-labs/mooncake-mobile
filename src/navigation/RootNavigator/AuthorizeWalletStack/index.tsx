import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LookingForDevices, { LookingForDevicesParams } from 'screens/LookingForDevices';
import ConnectToLedger, { ConnectToLedgerParams } from 'screens/ConnectToLedger';
import ROUTES from 'navigation/routes';
import EnterPassword, { EnterPasswordParams } from 'screens/EnterPassword';

export type AuthorizeWalletParamList = {
  [ROUTES.AUTH_LOOKING_FOR_DEVICES]: LookingForDevicesParams;

  [ROUTES.AUTH_CONNECT_TO_LEDGER]: ConnectToLedgerParams;

  [ROUTES.AUTH_UNLOCK_LOCAL_WALLET]: EnterPasswordParams;
};

const Stack = createStackNavigator<AuthorizeWalletParamList>();

/**
 * Navigation stack for authorizing and unlocking the user's stored wallets
 * and/or accounts
 */
const AuthorizeWalletStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.AUTH_LOOKING_FOR_DEVICES} component={LookingForDevices} />

      <Stack.Screen name={ROUTES.AUTH_CONNECT_TO_LEDGER} component={ConnectToLedger} />

      <Stack.Screen name={ROUTES.AUTH_UNLOCK_LOCAL_WALLET} component={EnterPassword} />
    </Stack.Navigator>
  );
};

export default AuthorizeWalletStack;
