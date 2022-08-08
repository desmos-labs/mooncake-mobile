import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import FullscreenStatusScreen, {
  FullscreenStatusScreenParams,
} from 'screens/FullscreenStatusScreen';
import CheckMnemonic, {CheckMnemonicParams} from 'screens/CheckMnemonic';
import GenerateAccount, {BroadcastTxParams} from 'screens/BroadcastTx';
import Landing from 'screens/Landing';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import Home from 'screens/Home';
import BottomModal, {BottomModalParams} from 'screens/Modals/BottomModal';
import SendTips from 'screens/Modals/SendTips';
import TextOnlyModal, {TextOnlyModalParams} from 'screens/Modals/TextOnlyModal';
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
import SelectDtag, {SelectDtagParamList} from 'screens/SelectDtag';
import ConsentAgreement from 'screens/Modals/ConsentAgreement';
import DevScreen from 'screens/DEV';
import WelcomePage from 'screens/WelcomePage';
import Signup from 'screens/Signup';
import NoDtagFound from 'screens/NoDtagFound';
import useInitializeAppData from 'hooks/useInitializeAppData';
import CreateDesmosProfile from 'screens/CreateDesmosProfile';
import WelcomeBack from 'screens/WelcomeBack';
import AuthorizeWalletStack, {
  AuthorizeWalletParams,
} from 'navigation/RootNavigator/AuthorizeWalletStack';
import {NavigatorScreenParams} from '@react-navigation/native';
import ConnectAddressGeneral from 'screens/ConnectAddress/General';
import ConfirmAddress, {ConfirmAddressParams} from 'screens/ConfirmAddress';
import ConnectChainMethod from 'screens/ConnectChainMethod';
import DisconnectChainModal, {
  DisconnectChainParams,
} from 'screens/Modals/DisconnectChainModal';
import SelectChainConnection from 'screens/SelectChainConnection';
import ConnectAddressAdvanced from 'screens/ConnectAddress/Advanced';
import PostInteractionTabs, {
  PostInteractionTabsParamList,
} from 'navigation/RootNavigator/PostInteractionTabs';
import ConnectChainTxDetail from 'screens/ConnectChainTxDetail';

export type RootNavigatorParamList = {
  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;
  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.RESULT_MODAL]: ResultModalParams;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
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
  [ROUTES.SELECT_DTAG]: SelectDtagParamList;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.CONSENT_AGREEMENT]: undefined;
  [ROUTES.WELCOME_PAGE]: undefined;
  [ROUTES.FULLSCREEN_STATUS_SCREEN]: FullscreenStatusScreenParams;
  [ROUTES.BOTTOM_MODAL]: BottomModalParams;
  [ROUTES.NO_DTAG_FOUND]: undefined;
  [ROUTES.BROADCAST_TX]: BroadcastTxParams;
  [ROUTES.CREATE_DESMOS_PROFILE]: undefined;
  [ROUTES.WELCOME_BACK]: undefined;
  [ROUTES.CONNECT_ADDRESS_GENERAL]: undefined;
  [ROUTES.CONNECT_ADDRESS_ADVANCED]: undefined;
  [ROUTES.CONFIRM_ADDRESS]: ConfirmAddressParams;
  [ROUTES.CONNECT_CHAIN_METHOD]: undefined;
  [ROUTES.DISCONNECT_CHAIN_MODAL]: DisconnectChainParams;
  [ROUTES.SELECT_CHAIN]: undefined;
  [ROUTES.SEND_TIPS]: undefined;
  [ROUTES.CONNECT_CHAIN_TX_DETAIL]: undefined;

  // Nested navigators
  [ROUTES.AUTHORIZE_WALLET]: NavigatorScreenParams<AuthorizeWalletParams>;

  // Post interaction tabs
  [ROUTES.POST_INTERACTION]: NavigatorScreenParams<PostInteractionTabsParamList>;

  // only for dev
  [ROUTES.DEV_SCREEN]: undefined;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  // Initialization. Move to Landing page once ready.
  useInitializeAppData();
  // End initialization

  const {t} = useTranslation();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {__DEV__ && (
        <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />
      )}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />

      <Stack.Screen
        name={ROUTES.CREATE_DESMOS_PROFILE}
        component={CreateDesmosProfile}
      />
      <Stack.Screen name={ROUTES.WELCOME_BACK} component={WelcomeBack} />
      <Stack.Screen name={ROUTES.NO_DTAG_FOUND} component={NoDtagFound} />
      <Stack.Screen name={ROUTES.SELECT_DTAG} component={SelectDtag} />

      {/* Perhaps turn this into a more general "BroadcastTx" screen that */}
      {/* navigates away once the tx is finished broadcasting */}
      <Stack.Screen name={ROUTES.BROADCAST_TX} component={GenerateAccount} />

      <Stack.Screen
        name={ROUTES.FULLSCREEN_STATUS_SCREEN}
        component={FullscreenStatusScreen}
      />
      <Stack.Screen
        initialParams={{
          mnemonic:
            'test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo',
        }}
        name={ROUTES.CHECK_MNEMONIC}
        component={CheckMnemonic}
      />
      <Stack.Screen name={ROUTES.WELCOME_PAGE} component={WelcomePage} />
      <Stack.Screen name={ROUTES.SIGNUP} component={Signup} />
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
        initialParams={{
          bleLedger: {
            id: '123',
            name: 'hello world',
          },
        }}
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

      <Stack.Screen
        name={ROUTES.CONNECT_ADDRESS_GENERAL}
        component={ConnectAddressGeneral}
      />

      <Stack.Screen
        name={ROUTES.CONNECT_ADDRESS_ADVANCED}
        component={ConnectAddressAdvanced}
      />

      <Stack.Screen
        initialParams={{
          address: 'testAddress123123',
        }}
        name={ROUTES.CONFIRM_ADDRESS}
        component={ConfirmAddress}
      />

      <Stack.Screen
        name={ROUTES.SELECT_CHAIN}
        component={SelectChainConnection}
      />

      <Stack.Screen
        name={ROUTES.CONNECT_CHAIN_TX_DETAIL}
        component={ConnectChainTxDetail}
      />

      <Stack.Group
        screenOptions={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
          ...TransitionPresets.BottomSheetAndroid,
        }}>
        <Stack.Screen
          name={ROUTES.CONSENT_AGREEMENT}
          component={ConsentAgreement}
        />
        <Stack.Screen name={ROUTES.CONFIRM_MODAL} component={ConfirmModal} />
        <Stack.Screen name={ROUTES.SEND_TIPS} component={SendTips} />
        <Stack.Screen
          initialParams={{
            title: t('confirmModal:removeProfile'),
            body: t('confirmModal:backupSeedphrase'),
            primaryButtonLabel: t('confirmModal:goToBackup'),
          }}
          name={ROUTES.BOTTOM_MODAL}
          component={BottomModal}
        />
        <Stack.Screen
          initialParams={{
            title: t('signup:profile dtag'),
            body: t('signup:dtag info'),
          }}
          name={ROUTES.TEXTONLY_MODAL}
          component={TextOnlyModal}
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

        <Stack.Screen
          name={ROUTES.DISCONNECT_CHAIN_MODAL}
          component={DisconnectChainModal}
          initialParams={{
            chainLink: {
              userAddress: 'userAddress',
              chainName: 'Cosmos Hub',
              creationTime: new Date(),
              externalAddress: 'externalAddress',
            },
          }}
        />

        <Stack.Screen
          name={ROUTES.POST_INTERACTION}
          component={PostInteractionTabs}
        />
      </Stack.Group>

      <Stack.Screen
        name={ROUTES.CONNECT_CHAIN_METHOD}
        component={ConnectChainMethod}
      />

      <Stack.Screen
        name={ROUTES.AUTHORIZE_WALLET}
        component={AuthorizeWalletStack}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
