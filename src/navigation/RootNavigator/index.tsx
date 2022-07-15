import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import Home from 'screens/Home';
import EnterPassword from 'screens/EnterPassword';
import ChangePassword from 'screens/ChangePassword';
import ConfirmModal, {ConfirmModalParams} from 'screens/Modals/ConfirmModal';
import ResultModal, {ResultModalParams} from 'screens/Modals/ResultModal';
import {useTranslation} from 'react-i18next';
import RevealRecoveryPhrase from 'screens/RevealRecoveryPhrase';
import Settings from 'screens/Settings';
import Community from 'screens/Community';
import Profiles from 'screens/Profiles';
import LookingForDevices from 'screens/LookingForDevices';
import ConnectToLedger, {ConnectToLedgerParams} from 'screens/ConnectToLedger';
import Profile from 'screens/Profile';
import ShowRecoveryPhrase from 'screens/ShowRecoveryPhrase';

export type RootNavigatorParamList = {
  [ROUTES.CHANGE_PASSWORD]: undefined;
  [ROUTES.ENTER_PASSWORD]: undefined;
  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.RESULT_MODAL]: ResultModalParams;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.LOOKING_FOR_DEVICES]: undefined;
  [ROUTES.CONNECT_TO_LEDGER]: ConnectToLedgerParams;
  [ROUTES.HOME]: undefined;
  [ROUTES.USER_PROFILE]: undefined;
  [ROUTES.SETTINGS_PROFILES]: undefined;
  [ROUTES.SETTINGS_COMMUNITY]: undefined;
  [ROUTES.SETTINGS_REVEAL_SECRET_PHRASE]: undefined;
  [ROUTES.SETTINGS_SHOW_SECRET_PHRASE]: undefined;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.USER_PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.SETTINGS_PROFILES} component={Profiles} />
      <Stack.Screen name={ROUTES.ENTER_PASSWORD} component={EnterPassword} />
      <Stack.Screen name={ROUTES.SETTINGS_COMMUNITY} component={Community} />
      <Stack.Screen
        name={ROUTES.LOOKING_FOR_DEVICES}
        component={LookingForDevices}
      />
      <Stack.Screen
        name={ROUTES.CONNECT_TO_LEDGER}
        component={ConnectToLedger}
      />
      <Stack.Screen
        name={ROUTES.SETTINGS_REVEAL_SECRET_PHRASE}
        component={RevealRecoveryPhrase}
      />
      <Stack.Screen
        name={ROUTES.SETTINGS_SHOW_SECRET_PHRASE}
        component={ShowRecoveryPhrase}
      />
      <Stack.Screen name={ROUTES.ENTER_PASSWORD} component={EnterPassword} />
      <Stack.Screen name={ROUTES.CHANGE_PASSWORD} component={ChangePassword} />
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
            title: t('confirmModal:removeProfile'),
            subtitle: t('confirmModal:backupSeedphrase'),
            primaryButtonLabel: t('confirmModal:goToBackup'),
            secondaryButtonLabel: t('confirmModal:remove'),
          }}
          name={ROUTES.CONFIRM_MODAL}
          component={ConfirmModal}
        />
        <Stack.Screen
          initialParams={{
            title: t('resultModal:success'),
            subtitle: t('resultModal:passwordWasChanged'),
            primaryButtonLabel: t('resultModal:goToProfile'),
          }}
          name={ROUTES.RESULT_MODAL}
          component={ResultModal}
        />
      </Stack.Group>
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
