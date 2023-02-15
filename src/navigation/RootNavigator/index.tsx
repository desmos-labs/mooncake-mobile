import { createStackNavigator } from '@react-navigation/stack';
import { getMMKV, MMKVKEYS } from 'lib/MMKVStorage';
import ROUTES from 'navigation/routes';
import React from 'react';
import DevScreen from 'screens/DEV';
import MnemonicInput from 'screens/MnemonicInput';
import useInitializeAppData from 'hooks/useInitializeAppData';
import useInitializeNotifications from 'hooks/useInitializeNotifications';
import useInitializeDynamicLinks from 'hooks/useInitializeDynamicLinks';
import TextOnlyModal, { TextOnlyModalParams } from 'screens/Modals/TextOnlyModal';
import Signup from 'screens/Signup';
import Landing from 'screens/Landing';
import SaveProfile, { SaveProfileParams } from 'screens/SaveProfile';
import BackupPhraseBottomModal from 'screens/Modals/BackupPhraseBottomModal';
import BottomTabs, { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import Onboarding, { OnboardingParams } from 'screens/Onboarding';
import SelectAccount, { SelectAccountParamList } from 'screens/SelectAccount';
import ConsentAgreement, { ConsentAgreementParams } from 'screens/Modals/ConsentAgreement';
import ImportAccountSelectMode from 'screens/ImportAccountSelectMode';
import SaveAccount, { SaveAccountParams } from 'screens/SaveAccount';
import ChangePassword, {
  PASSWORD_MANIPULATION_MODE,
  PasswordManipulationParams,
} from 'screens/PasswordManipulation';
import ConnectToLedgerStack, {
  ConnectToLedgerStackParams,
} from 'navigation/RootNavigator/ConnectToLedgerStack';
import HomeTabs, { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import SelectLedgerApp from 'screens/SelectLedgerApp';
import Settings from 'screens/Settings';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import UnlockWallet, { UnlockWalletParams } from 'screens/UnlockWallet';
import BroadcastTxOnChain, { BroadcastTxParams } from 'screens/BroadcastTxOnChain';
import PostDetails, { PostDetailsParams } from 'screens/PostDetails';
import WelcomeBack from 'screens/WelcomeBack';
import CreatePost, { CreatePostParams } from 'screens/CreatePost';
import ReportPost, { ReportPostParams } from 'screens/Modals/ReportPost';
import SendTips, { SendTipsParams } from 'screens/Modals/SendTips';
import PostInteractionTabs, {
  PostInteractionReactionsTabParams,
  PostInteractionTabsParamList,
} from 'navigation/RootNavigator/PostInteractionTabs';
import ImportAccountSelectChain from 'screens/ImportAccountSelectChain';
import DisconnectChainModal, { DisconnectChainParams } from 'screens/Modals/DisconnectChainModal';
import ConfirmModal, { ConfirmModalParams } from 'screens/Modals/ConfirmModal';
import DisconnectAppModal, { DisconnectAppParams } from 'screens/Modals/DisconnectAppModal';
import ManageConnectedApps from 'screens/ManageConnectedApps';
import SettingsEnableBiometrics from 'screens/SettingsEnableBiometrics';
import Invites from 'screens/Invites';

export type RootNavigatorParamList = {
  // -------------------------------------------------------------------------------------
  // --- DEV SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.DEV_SCREEN]: undefined;

  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.LANDING]: undefined;
  // [ROUTES.LOGIN]: LoginParams | undefined;
  [ROUTES.SIGNUP]: undefined;

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_MODE]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP]: undefined;
  [ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT]: SelectAccountParamList;
  [ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT]: SaveAccountParams;

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  [ROUTES.BOTTOM_TABS]: NavigatorScreenParams<BottomTabsParamList>;
  [ROUTES.ACTIVITIES]: undefined;

  // Home page
  [ROUTES.HOME_TABS]: NavigatorScreenParams<HomeTabsParamList>;

  // -------------------------------------------------------------------------------------
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.CREATE_POST]: CreatePostParams | undefined;
  [ROUTES.POST_DETAILS]: PostDetailsParams;
  [ROUTES.REPORT_POST]: ReportPostParams;

  // Post interactions
  [ROUTES.POST_INTERACTION]: NavigatorScreenParams<PostInteractionTabsParamList>;
  [ROUTES.POST_REACTIONS]: PostInteractionReactionsTabParams;
  // [ROUTES.POST_TIPS]: PostInteractionTipsTabsParams;

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.SETTINGS]: undefined;
  // [ROUTES.SETTINGS_PROFILES]: undefined;
  // [ROUTES.SETTINGS_COMMUNITY]: undefined;
  // [ROUTES.SETTINGS_REVEAL_SECRET_PHRASE]: undefined;
  // [ROUTES.SETTINGS_SHOW_SECRET_PHRASE]: ShowSecretPhraseParams;
  [ROUTES.SETTINGS_ENABLE_BIOMETRICS]: undefined;
  [ROUTES.SETTINGS_INVITES]: undefined;
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;

  // -------------------------------------------------------------------------------------
  // --- CONNECT TO LEDGER SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.CONNECT_TO_LEDGER_STACK]: ConnectToLedgerStackParams;

  // -------------------------------------------------------------------------------------
  // --- CHAIN LINKS SCREEN
  // -------------------------------------------------------------------------------------

  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;

  // Connect chain
  // [ROUTES.CONNECT_ADDRESS_GENERAL]: ConnectAddressGeneralParams | undefined;
  // [ROUTES.CONNECT_ADDRESS_ADVANCED]: ConnectAddressAdvancedParams | undefined;

  // Disconnect chain
  [ROUTES.DISCONNECT_CHAIN_MODAL]: DisconnectChainParams;

  // -------------------------------------------------------------------------------------
  // --- APP LINKS SCREEN
  // -------------------------------------------------------------------------------------

  [ROUTES.MANAGE_CONNECTED_APPS]: undefined;
  // [ROUTES.CONNECT_APP]: ConnectAppParams;

  // Disconnect app modal
  [ROUTES.DISCONNECT_APP_MODAL]: DisconnectAppParams;

  // Twitter connection
  // [ROUTES.SELECT_TWEET]: SelectTweetParams;

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREEN
  // -------------------------------------------------------------------------------------

  // [ROUTES.ADD_PROFILE]: AddProfileParams;
  // [ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL]: AddProfileSelectAddressGeneralParams;
  // [ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED]: AddProfileSelectAddressAdvancedParams;
  // [ROUTES.ADD_PROFILE_MODAL]: AddProfileModalParams;

  // Profile creation/saving
  [ROUTES.SAVE_PROFILE]: SaveProfileParams | undefined;

  // Profile posts
  // [ROUTES.PROFILE_POSTS]: ProfilePostsTabsParams;
  // [ROUTES.PROFILE_POSTS_POSTS]: PostsTabParams;
  // [ROUTES.PROFILE_POSTS_LIKED]: PostsTabParams;
  // [ROUTES.PROFILE_POSTS_TIPPED]: PostsTabParams;

  // Profile followage
  // [ROUTES.FOLLOWING_AND_FOLLOWERS]: NavigatorScreenParams<FollowingAndFollowersParams>;
  // [ROUTES.FOLLOWING]: FollowingParams;
  // [ROUTES.FOLLOWERS]: FollowingParams;

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  // [ROUTES.SIGNUP_RESULT]: undefined;
  // [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  // [ROUTES.GUEST_PROFILE]: GuestProfileParams | undefined;
  // [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.CONSENT_AGREEMENT]: ConsentAgreementParams;
  // [ROUTES.FULLSCREEN_STATUS_SCREEN]: FullscreenStatusScreenParams;
  // [ROUTES.BOTTOM_MODAL]: BottomModalParams;
  // [ROUTES.NO_DTAG_FOUND]: undefined;
  [ROUTES.BROADCAST_TX_ON_CHAIN]: BroadcastTxParams;
  [ROUTES.WELCOME_BACK]: undefined; // [ROUTES.CONFIRM_ADDRESS]: ConfirmAddressParams;
  // [ROUTES.CONNECT_CHAIN_METHOD]: undefined;
  [ROUTES.SEND_TIPS]: SendTipsParams;
  // [ROUT     ES.CONNECT_CHAIN_TX_DETAIL]: ConnectChainTxDetailParams;
  // [ROUTES.ACTION_AUTHORIZATION]: ActionAuthorizationParams;
  // [ROUTES.SELECT_POST_TYPE]: undefined;
  // [ROUTES.CREATE_TEXT_POST]: undefined;
  // Nested navigators

  // Nfts
  // [ROUTES.PROFILE_NFTS]: undefined;
  // [ROUTES.NFT_DETAILS]: NftDetailsParams;

  // Apps and Twitter
  // [ROUTES.APP_DETAILS]: AppDetailsParams;

  // Grants
  // [ROUTES.GRANTS]: undefined;
  // [ROUTES.GRANTS_DETAILS]: GrantsDetailsParams;

  // [ROUTES.MANAGE_INVITES]: undefined;
  // [ROUTES.IMPACT_POINTS_MODAL]: undefined;

  // Onboarding
  [ROUTES.ONBOARDING]: OnboardingParams;

  // New profile
  // [ROUTES.MANAGE_CONNECTIONS_MODAL]: ManageConnectionsModalParams;
  // [ROUTES.CONVERTIBLE_POINTS_MODAL]: undefined;
  // [ROUTES.OPERATIONS]: OperationsParams;
};

/* const NativeTransition = Platform.select({
  ios: ModalPresentationIOS,
  default: BottomSheetAndroid,
}); */

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  // Initialization. Move to Landing page once ready.
  useInitializeAppData();
  useInitializeNotifications();
  useInitializeDynamicLinks();

  // const theme = useTheme();

  /**
   * This need to be removed
   */
  /* To allow going back to previous screen via swipe left. */
  // const {height, width} = Dimensions.get('window');
  // const gestureResponseDistance = Math.max(height, width);

  /* const styles: {[key: string]: ViewStyle | TextStyle} = {
    followingAndFollowers: {
      backgroundColor: theme.colors.white,
    },
    addProfileCard: {
      backgroundColor: 'rgb(245,246,249)',
    },
    statusScreen: {
      backgroundColor: 'rgb(175,175,175)',
    },
  }; */

  /**
   * End
   */

  const initialRouteName = React.useMemo(() => {
    if (__DEV__) return ROUTES.DEV_SCREEN;
    const activeAddr = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS);

    if (activeAddr) {
      return ROUTES.BOTTOM_TABS;
    }
    return ROUTES.ONBOARDING;
  }, []);

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}>
      {/* ------------------- */}
      {/* --- DEV SCREENS --- */}
      {/* ------------------- */}
      {__DEV__ && <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />}

      {/* --- INITIAL SCREENS --- */}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      {/* <Stack.Screen name={ROUTES.LOGIN} component={Login} /> */}
      <Stack.Screen name={ROUTES.SIGNUP} component={Signup} />

      {/* ------------------------ */}
      {/* --- ACCOUNTS SCREENS --- */}
      {/* ------------------------ */}

      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN}
        component={ImportAccountSelectChain}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_MODE} component={ImportAccountSelectMode} />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP} component={SelectLedgerApp} />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT} component={MnemonicInput} />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT} component={SelectAccount} />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT} component={SaveAccount} />

      {/* -------------------- */}
      {/* --- HOME SCREENS --- */}
      {/* -------------------- */}

      <Stack.Screen name={ROUTES.BOTTOM_TABS} component={BottomTabs} />
      {/* <Stack.Screen name={ROUTES.ACTIVITIES} component={Activities} /> */}
      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />

      {/* -------------------- */}
      {/* --- POST SCREENS --- */}
      {/* -------------------- */}

      <Stack.Screen name={ROUTES.CREATE_POST} component={CreatePost} />
      <Stack.Screen name={ROUTES.POST_DETAILS} component={PostDetails} />
      <Stack.Screen name={ROUTES.REPORT_POST} component={ReportPost} />
      <Stack.Screen name={ROUTES.POST_INTERACTION} component={PostInteractionTabs} />

      {/* ------------------------ */}
      {/* --- SETTINGS SCREENS --- */}
      {/* ------------------------ */}

      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      {/* <Stack.Screen name={ROUTES.SETTINGS_PROFILES} component={Profiles} /> */}
      {/* <Stack.Screen name={ROUTES.SETTINGS_COMMUNITY} component={Community} /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.SETTINGS_REVEAL_SECRET_PHRASE} */}
      {/*  component={RevealRecoveryPhrase} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.SETTINGS_SHOW_SECRET_PHRASE} */}
      {/*  component={ShowRecoveryPhrase} */}
      {/* /> */}
      <Stack.Screen name={ROUTES.SETTINGS_ENABLE_BIOMETRICS} component={SettingsEnableBiometrics} />
      <Stack.Screen name={ROUTES.SETTINGS_INVITES} component={Invites} />
      <Stack.Screen name={ROUTES.UNLOCK_WALLET} component={UnlockWallet} />

      {/* --------------------------------- */}
      {/* --- CONNECT TO LEDGER SCREENS --- */}
      {/* --------------------------------- */}

      <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER_STACK} component={ConnectToLedgerStack} />

      {/* --------------------------- */}
      {/* --- CHAIN LINKS SCREENS --- */}
      {/* --------------------------- */}

      <Stack.Screen name={ROUTES.MANAGE_CONNECTED_CHAINS} component={ManageConnectedChains} />
      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_ADDRESS_GENERAL} */}
      {/*  component={ConnectAddressGeneral} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_ADDRESS_ADVANCED} */}
      {/*  component={ConnectAddressAdvanced} */}
      {/* /> */}
      <Stack.Screen name={ROUTES.DISCONNECT_CHAIN_MODAL} component={DisconnectChainModal} />

      {/* ------------------------- */}
      {/* --- APP LINKS SCREENS --- */}
      {/* ------------------------- */}

      <Stack.Screen name={ROUTES.MANAGE_CONNECTED_APPS} component={ManageConnectedApps} />
      {/* <Stack.Screen name={ROUTES.CONNECT_APP} component={ConnectApp} /> */}
      <Stack.Screen name={ROUTES.DISCONNECT_APP_MODAL} component={DisconnectAppModal} />
      {/* <Stack.Screen name={ROUTES.SELECT_TWEET} component={SelectTweet} /> */}

      {/* ----------------------- */}
      {/* --- PROFILE SCREENS --- */}
      {/* ----------------------- */}

      {/* <Stack.Screen name={ROUTES.ADD_PROFILE} component={AddProfile} /> */}
      {/* <Stack.Screen name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL} component={AddProfileSelectAddressGeneral} */}
      {/* <Stack.Screen name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED} component={AddProfileSelectAddressAdvanced} */}
      {/* <Stack.Screen  name={ROUTES.ADD_PROFILE_MODAL} component={AddProfileModal} /> */}
      <Stack.Screen name={ROUTES.SAVE_PROFILE} component={SaveProfile} />

      {/* <Stack.Screen */}
      {/*  name={ROUTES.FOLLOWING_AND_FOLLOWERS} */}
      {/*  component={FollowingAndFollowers} */}
      {/*  options={{ */}
      {/*    gestureResponseDistance, */}
      {/*    cardStyle: styles.followingAndFollowers, */}
      {/*  }} */}
      {/* /> */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.PROFILE_POSTS} */}
      {/*  component={ProfilePosts} */}
      {/*  options={{ */}
      {/*    gestureResponseDistance, */}
      {/*  }} */}
      {/* /> */}

      {/* ------------------------------ */}
      {/* TODO: Categorize these screens */}
      {/* ------------------------------ */}

      <Stack.Screen name={ROUTES.WELCOME_BACK} component={WelcomeBack} />
      {/* <Stack.Screen name={ROUTES.NO_DTAG_FOUND} component={NoDtagFound} /> */}

      {/* Perhaps turn this into a more general "BroadcastTx" screen that */}
      {/* navigates away once the tx is finished broadcasting */}
      <Stack.Screen name={ROUTES.BROADCAST_TX_ON_CHAIN} component={BroadcastTxOnChain} />

      {/* <Stack.Screen */}
      {/*  name={ROUTES.FULLSCREEN_STATUS_SCREEN} */}
      {/*  component={FullscreenStatusScreen} */}
      {/*  options={{cardStyle: styles.statusScreen}} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  initialParams={{ */}
      {/*    mnemonic: */}
      {/*      'test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo test this mnemo', */}
      {/*  }} */}
      {/*  name={ROUTES.CHECK_MNEMONIC} */}
      {/*  component={CheckMnemonic} */}
      {/* /> */}
      {/* <Stack.Screen name={ROUTES.WELCOME_PAGE} component={WelcomePage} /> */}
      {/* <Stack.Screen name={ROUTES.GUEST_PROFILE} component={GuestProfile} /> */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.LOOKING_FOR_DEVICES} */}
      {/*  component={LookingForDevices} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  initialParams={{ */}
      {/*    bleLedger: { */}
      {/*      id: '123', */}
      {/*      name: 'hello world', */}
      {/*    }, */}
      {/*  }} */}
      {/*  name={ROUTES.CONNECT_TO_LEDGER} */}
      {/*  component={ConnectToLedger} */}
      {/* /> */}
      <Stack.Screen
        initialParams={{
          mode: PASSWORD_MANIPULATION_MODE.SETUP_PASSWORD,
        }}
        name={ROUTES.PASSWORD_MANIPULATION}
        component={ChangePassword}
      />

      {/* <Stack.Screen */}
      {/*  initialParams={{ */}
      {/*    address: 'testAddress123123', */}
      {/*  }} */}
      {/*  name={ROUTES.CONFIRM_ADDRESS} */}
      {/*  component={ConfirmAddress} */}
      {/* /> */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_CHAIN_TX_DETAIL} */}
      {/*  component={ConnectChainTxDetail} */}
      {/* /> */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_CHAIN_METHOD} */}
      {/*  component={ConnectChainMethod} */}
      {/* /> */}

      {/* <Stack.Screen name={ROUTES.CREATE_TEXT_POST} component={CreateTextPost} /> */}

      {/* <Stack.Screen name={ROUTES.GRANTS} component={Grants} /> */}

      {/* <Stack.Screen name={ROUTES.GRANTS_DETAILS} component={GrantsDetails} /> */}

      {/* <Stack.Screen name={ROUTES.MANAGE_INVITES} component={ManageInvites} /> */}

      <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />

      {/* <Stack.Screen name={ROUTES.OPERATIONS} component={Operations} /> */}

      {/* modals */}
      {/* <Stack.Group */}
      {/*  screenOptions={{ */}
      {/*    cardStyle: { */}
      {/*      backgroundColor: 'transparent', */}
      {/*    }, */}
      {/*    presentation: 'transparentModal', */}
      {/*    cardOverlayEnabled: true, */}
      {/*    ...NativeTransition, */}
      {/*  }}> */}
      {/*  <Stack.Screen */}
      {/*    name={ROUTES.CONSENT_AGREEMENT} */}
      {/*    component={ConsentAgreement} */}
      {/*  /> */}
      <Stack.Screen name={ROUTES.CONFIRM_MODAL} component={ConfirmModal} />
      <Stack.Screen name={ROUTES.SEND_TIPS} component={SendTips} />
      {/*  <Stack.Screen name={ROUTES.BOTTOM_MODAL} component={BottomModal} /> */}
      {/*  <Stack.Screen */}
      {/*    name={ROUTES.MANAGE_CONNECTIONS_MODAL} */}
      {/*    component={ManageConnectionsModal} */}
      {/*  /> */}
      {/*  <Stack.Screen */}
      {/*    name={ROUTES.IMPACT_POINTS_MODAL} */}
      {/*    component={ImpactPointsModal} */}
      {/*  /> */}
      {/*  <Stack.Screen */}
      {/*    name={ROUTES.CONVERTIBLE_POINTS_MODAL} */}
      {/*    component={ConvertiblePointsModal} */}
      {/*  /> */}

      <Stack.Screen name={ROUTES.BACKUP_PHRASE_BOTTOM_MODAL} component={BackupPhraseBottomModal} />
      <Stack.Screen name={ROUTES.TEXTONLY_MODAL} component={TextOnlyModal} />
      <Stack.Screen name={ROUTES.CONSENT_AGREEMENT} component={ConsentAgreement} />

      {/*  <Stack.Screen */}
      {/*    name={ROUTES.ACTION_AUTHORIZATION} */}
      {/*    component={ActionAuthorization} */}
      {/*  /> */}

      {/* </Stack.Group> */}

      {/* /!* modals end *!/ */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.AUTHORIZE_WALLET} */}
      {/*  component={AuthorizeWalletStack} */}
      {/* /> */}

      {/* <Stack.Screen name={ROUTES.PROFILE_NFTS} component={ProfileNfts} /> */}
      {/* <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} /> */}
      {/* <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
