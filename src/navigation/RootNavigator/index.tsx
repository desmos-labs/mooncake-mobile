import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import Home from 'screens/Home';

const Stack = createStackNavigator();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
