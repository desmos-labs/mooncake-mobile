import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LookingForDevices, {
  LookingForDevicesParams,
} from 'screens/LookingForDevices';
import ConnectToLedger, {ConnectToLedgerParams} from 'screens/ConnectToLedger';
import ROUTES from 'navigation/routes';
import {useRoute} from '@react-navigation/native';

export type AuthorizeViaLedgerParamList = {
  [ROUTES.AUTH_LOOKING_FOR_DEVICES]: LookingForDevicesParams;

  [ROUTES.AUTH_CONNECT_TO_LEDGER]: ConnectToLedgerParams;
};

const Stack = createStackNavigator<AuthorizeViaLedgerParamList>();

const AuthorizeViaLedgerStack = () => {
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
    </Stack.Navigator>
  );
};

export default AuthorizeViaLedgerStack;
