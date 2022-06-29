import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import EnterPassword from 'screens/EnterPassword';

const Stack = createStackNavigator();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name={ROUTES.ENTER_PASSWORD} component={EnterPassword} />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
