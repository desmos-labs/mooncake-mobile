import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LookingForDevices, {
  LookingForDevicesParams,
} from 'screens/LookingForDevices';
import ConnectToLedger, {ConnectToLedgerParams} from 'screens/ConnectToLedger';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';
import EnterPassword, {EnterPasswordParams} from 'screens/EnterPassword';

export type AuthorizeWalletParams = {
  [ROUTES.AUTH_LOOKING_FOR_DEVICES]: LookingForDevicesParams;

  [ROUTES.AUTH_CONNECT_TO_LEDGER]: ConnectToLedgerParams;

  [ROUTES.AUTH_UNLOCK_LOCAL_WALLET]: EnterPasswordParams;
};

const Stack = createStackNavigator<AuthorizeWalletParams>();

const AuthorizeWalletStack = () => {
  const {params} = useRoute<any>();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.AUTH_LOOKING_FOR_DEVICES}
        component={LookingForDevices}
        initialParams={params}
      />

      <Stack.Screen
        name={ROUTES.AUTH_CONNECT_TO_LEDGER}
        component={ConnectToLedger}
      />

      <Stack.Screen
        name={ROUTES.AUTH_UNLOCK_LOCAL_WALLET}
        component={EnterPassword}
        initialParams={params}
      />
    </Stack.Navigator>
  );
};

export default AuthorizeWalletStack;
