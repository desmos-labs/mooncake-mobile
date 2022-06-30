import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import Home from 'screens/Home';
import EnterPassword from 'screens/EnterPassword';
import ChangePassword from 'screens/ChangePassword';
import ResultModal, {ResultModalParams} from 'screens/ResultModal';
import {useTranslation} from 'react-i18next';
import Settings from 'screens/Settings';

export type RootNavigatorParamList = {
  [ROUTES.CHANGE_PASSWORD]: undefined;
  [ROUTES.ENTER_PASSWORD]: undefined;
  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.RESULT_MODAL]: ResultModalParams;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.HOME]: undefined;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen name={ROUTES.ENTER_PASSWORD} component={EnterPassword} />
      <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePassword} />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Group
        screenOptions={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
        }}>
        <Stack.Screen
          initialParams={{
            title: t('resultModal:success'),
            subtitle: t('resultModal:passwordWasChanged'),
            primaryButtonLabel: t('resultModal:goToProfile'),
          }}
          name={ROUTES.RESULT_MODAL}
          component={ResultModal}
        />
        <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
