import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import Home from 'screens/Home';
import EnterPassword from 'screens/EnterPassword';
import ChangePassword, {
  PASSWORD_MANIPULATION_MODE,
  PasswordManipulationParams,
} from 'screens/PasswordManipulation';
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
import MnemonicInput, {
  MNEMONIC_INPUT_MODE,
  MnemonicInputParams,
} from 'screens/MnemonicInput';
import ShowRecoveryPhrase from 'screens/ShowRecoveryPhrase';
import SelectDtag from 'screens/SelectDtag';

export type RootNavigatorParamList = {
  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;
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
  [ROUTES.MNEMONIC_INPUT]: MnemonicInputParams;
  [ROUTES.SETTINGS_REVEAL_SECRET_PHRASE]: undefined;
  [ROUTES.SETTINGS_SHOW_SECRET_PHRASE]: undefined;
  [ROUTES.SELECT_DTAG]: undefined;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  const {t} = useTranslation();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={ROUTES.SELECT_DTAG} component={SelectDtag} />

      <Stack.Screen
        initialParams={{
          mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
        }}
        name={ROUTES.MNEMONIC_INPUT}
        component={MnemonicInput}
      />
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.HOME} component={Home} />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen name={ROUTES.USER_PROFILE} component={Profile} />
      <Stack.Screen name={ROUTES.SETTINGS_PROFILES} component={Profiles} />
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
        initialParams={{
          mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
        }}
        name={ROUTES.PASSWORD_MANIPULATION}
        component={ChangePassword}
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
          // Remove these when going production
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
