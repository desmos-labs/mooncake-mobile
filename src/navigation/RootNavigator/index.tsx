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
import ImportAccountSelectAccount, {
  SelectAccountParamList,
} from 'screens/ImportAccountSelectAccount';
import ConsentAgreement, { ConsentAgreementParams } from 'screens/Modals/ConsentAgreement';
import ImportAccountSelectMode from 'screens/ImportAccountSelectMode';
import SaveAccount, { SaveAccountParams } from 'screens/SaveAccount';
import ChangePassword, { PasswordManipulationParams } from 'screens/PasswordManipulation';
import ConnectToLedgerStack, {
  ConnectToLedgerStackParams,
} from 'navigation/RootNavigator/ConnectToLedgerStack';
import HomeTabs, { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import ImportAccountSelectLedgerApp from 'screens/ImportAccountSelectLedgerApp';
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
  PostInteractionTabParams,
  PostInteractionTabsParamList,
} from 'navigation/RootNavigator/PostInteractionTabs';
import ImportAccountSelectChain from 'screens/ImportAccountSelectChain';
import DisconnectChainModal, { DisconnectChainParams } from 'screens/Modals/DisconnectChainModal';
import ConfirmModal, { ConfirmModalParams } from 'screens/Modals/ConfirmModal';
import DisconnectAppModal, { DisconnectAppParams } from 'screens/Modals/DisconnectAppModal';
import ManageConnectedApps from 'screens/ManageConnectedApps';
import SettingsEnableBiometrics from 'screens/SettingsEnableBiometrics';
import Invites from 'screens/Invites';
import ManageInvites from 'screens/ManageInvites';
import ImpactPointsModal from 'screens/Modals/ImpactPointsModal';
import Community from 'screens/Community';
import ShowPrivateKey, { ShowPrivateKeyScreenParams } from 'screens/ShowPrivateKey';
import Activities from 'screens/Activities';
import ConvertiblePointsModal from 'screens/Modals/ConvertiblePointsModal';
import ManageConnectionsModal, {
  ManageConnectionsModalParams,
} from 'screens/Profile/components/ManageConnectionsModal';
import ProfilePosts, { PostsTabParams, ProfilePostsTabsParams } from 'screens/ProfilePosts';
import Profile, { ProfileParams } from 'screens/Profile';
import { Dimensions } from 'react-native';
import WelcomePage from 'screens/WelcomePage';
import BottomModal, { BottomModalParams } from 'screens/Modals/BottomModal';
import { ProfileConnectionsParams, ProfileConnectionsTabParams } from 'screens/ProfileConnections';

export type RootNavigatorParamList = {
  // -------------------------------------------------------------------------------------
  // --- DEV SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.DEV_SCREEN]: undefined;

  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.LANDING]: undefined;
  [ROUTES.ONBOARDING]: OnboardingParams;
  [ROUTES.CONSENT_AGREEMENT]: ConsentAgreementParams;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.WELCOME]: undefined;

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_MODE]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP]: undefined;
  [ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT]: SelectAccountParamList;
  [ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT]: SaveAccountParams;

  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  [ROUTES.BOTTOM_TABS]: NavigatorScreenParams<BottomTabsParamList>;
  [ROUTES.ACTIVITIES]: undefined;

  // Home page
  [ROUTES.HOME_TABS]: NavigatorScreenParams<HomeTabsParamList>;

  // -------------------------------------------------------------------------------------
  // --- BROADCAST TRANSACTION SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.BROADCAST_TX_ON_CHAIN]: BroadcastTxParams;

  // -------------------------------------------------------------------------------------
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  // Post view
  [ROUTES.POST_DETAILS]: PostDetailsParams;

  // Post actions
  [ROUTES.POST_CREATE]: CreatePostParams | undefined;
  [ROUTES.POST_REPORT]: ReportPostParams;
  [ROUTES.POST_SEND_TIPS]: SendTipsParams;

  // Post interactions
  [ROUTES.POST_INTERACTION]: NavigatorScreenParams<PostInteractionTabsParamList>;
  [ROUTES.POST_REACTIONS]: PostInteractionTabParams;
  [ROUTES.POST_TIPS]: PostInteractionTabParams;

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.SETTINGS]: undefined;
  [ROUTES.SETTINGS_COMMUNITY]: undefined;
  [ROUTES.SETTINGS_SHOW_PRIVATE_KEY]: ShowPrivateKeyScreenParams;
  [ROUTES.SETTINGS_ENABLE_BIOMETRICS]: undefined;
  [ROUTES.SETTINGS_INVITES]: undefined;
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;

  // -------------------------------------------------------------------------------------
  // --- CONNECT TO LEDGER SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.CONNECT_TO_LEDGER_STACK]: ConnectToLedgerStackParams;

  // -------------------------------------------------------------------------------------
  // --- CHAIN LINKS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;

  // Disconnect chain
  [ROUTES.DISCONNECT_CHAIN_MODAL]: DisconnectChainParams;

  // -------------------------------------------------------------------------------------
  // --- APP LINKS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.MANAGE_CONNECTED_APPS]: undefined;
  // [ROUTES.CONNECT_APP]: ConnectAppParams;

  // Disconnect app modal
  [ROUTES.DISCONNECT_APP_MODAL]: DisconnectAppParams;

  // Twitter connection
  // [ROUTES.SELECT_TWEET]: SelectTweetParams;

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREENS
  // -------------------------------------------------------------------------------------

  // [ROUTES.ADD_PROFILE_MODAL]: AddProfileModalParams;

  // Profile creation/saving
  [ROUTES.SAVE_PROFILE]: SaveProfileParams | undefined;

  // Profile view
  [ROUTES.PROFILE]: undefined;
  [ROUTES.GUEST_PROFILE]: ProfileParams;

  // Profile posts
  [ROUTES.PROFILE_POSTS]: ProfilePostsTabsParams;
  [ROUTES.PROFILE_POSTS_POSTS]: PostsTabParams;
  [ROUTES.PROFILE_POSTS_LIKED]: PostsTabParams;
  [ROUTES.PROFILE_POSTS_TIPPED]: PostsTabParams;

  // Profile followage
  [ROUTES.PROFILE_CONNECTIONS]: ProfileConnectionsParams;
  [ROUTES.PROFILE_FOLLOWING]: ProfileConnectionsTabParams;
  [ROUTES.PROFILE_FOLLOWERS]: ProfileConnectionsTabParams;

  // -------------------------------------------------------------------------------------
  // --- INVITE SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.MANAGE_INVITES]: undefined;
  [ROUTES.IMPACT_POINTS_MODAL]: undefined;

  // -------------------------------------------------------------------------------------
  // --- MODALS
  // -------------------------------------------------------------------------------------

  [ROUTES.CONVERTIBLE_POINTS_MODAL]: undefined;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  [ROUTES.BOTTOM_MODAL]: BottomModalParams;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.MANAGE_CONNECTIONS_MODAL]: ManageConnectionsModalParams;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;

  // -------------------------------------------------------------------------------------
  // --- OTHER SCREENS
  // --- TODO: Categorize them as well
  // -------------------------------------------------------------------------------------

  // [ROUTES.SIGNUP_RESULT]: undefined;
  // [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;

  // [ROUTES.ACTION_AUTHORIZATION]: ActionAuthorizationParams;

  // Nfts
  // [ROUTES.PROFILE_NFTS]: undefined;
  // [ROUTES.NFT_DETAILS]: NftDetailsParams;

  // Apps and Twitter
  // [ROUTES.APP_DETAILS]: AppDetailsParams;

  // Grants
  // [ROUTES.GRANTS]: undefined;
  // [ROUTES.GRANTS_DETAILS]: GrantsDetailsParams;

  // Onboarding

  // New profile

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

  //  To allow going back to previous screen via swipe left.
  const { height, width } = Dimensions.get('window');
  const gestureResponseDistance = Math.max(height, width);

  // const theme = useTheme();
  // const styles: { [key: string]: ViewStyle | TextStyle } = {
  //   followingAndFollowers: {
  //     backgroundColor: theme.colors.white,
  //   },
  //   addProfileCard: {
  //     backgroundColor: 'rgb(245,246,249)',
  //   },
  //   statusScreen: {
  //     backgroundColor: 'rgb(175,175,175)',
  //   },
  // };

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

      {/* ----------------------- */}
      {/* --- INITIAL SCREENS --- */}
      {/* ----------------------- */}

      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomeBack} />

      <Stack.Screen name={ROUTES.SIGNUP} component={Signup} />
      <Stack.Screen name={ROUTES.WELCOME} component={WelcomePage} />
      <Stack.Screen name={ROUTES.CONSENT_AGREEMENT} component={ConsentAgreement} />

      {/* ------------------------ */}
      {/* --- ACCOUNTS SCREENS --- */}
      {/* ------------------------ */}

      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN}
        component={ImportAccountSelectChain}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_MODE} component={ImportAccountSelectMode} />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP}
        component={ImportAccountSelectLedgerApp}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT} component={MnemonicInput} />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT}
        component={ImportAccountSelectAccount}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT} component={SaveAccount} />

      <Stack.Screen name={ROUTES.PASSWORD_MANIPULATION} component={ChangePassword} />

      {/* ------------------------------------ */}
      {/* --- BROADCAST TRANSACTION SCREEN --- */}
      {/* ------------------------------------ */}

      <Stack.Screen name={ROUTES.BROADCAST_TX_ON_CHAIN} component={BroadcastTxOnChain} />

      {/* -------------------- */}
      {/* --- HOME SCREENS --- */}
      {/* -------------------- */}

      <Stack.Screen name={ROUTES.BOTTOM_TABS} component={BottomTabs} />
      <Stack.Screen name={ROUTES.ACTIVITIES} component={Activities} />
      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />

      {/* -------------------- */}
      {/* --- POST SCREENS --- */}
      {/* -------------------- */}

      <Stack.Screen name={ROUTES.POST_CREATE} component={CreatePost} />
      <Stack.Screen name={ROUTES.POST_DETAILS} component={PostDetails} />
      <Stack.Screen name={ROUTES.POST_REPORT} component={ReportPost} />
      <Stack.Screen name={ROUTES.POST_SEND_TIPS} component={SendTips} />
      <Stack.Screen name={ROUTES.POST_INTERACTION} component={PostInteractionTabs} />

      {/* ------------------------ */}
      {/* --- SETTINGS SCREENS --- */}
      {/* ------------------------ */}

      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.SETTINGS_COMMUNITY} component={Community} />
      <Stack.Screen name={ROUTES.SETTINGS_SHOW_PRIVATE_KEY} component={ShowPrivateKey} />
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

      {/* <Stack.Screen  name={ROUTES.ADD_PROFILE_MODAL} component={AddProfileModal} /> */}
      <Stack.Screen name={ROUTES.SAVE_PROFILE} component={SaveProfile} />

      {/* Profile visualization */}
      <Stack.Screen
        name={ROUTES.PROFILE}
        component={Profile}
        options={{
          gestureResponseDistance,
        }}
      />
      <Stack.Screen
        name={ROUTES.GUEST_PROFILE}
        component={Profile}
        options={{
          gestureResponseDistance,
        }}
      />
      <Stack.Screen
        name={ROUTES.PROFILE_POSTS}
        component={ProfilePosts}
        options={{
          gestureResponseDistance,
        }}
      />

      {/* <Stack.Screen */}
      {/*  name={ROUTES.PROFILE_FOLLOWING_AND_FOLLOWERS} */}
      {/*  component={FollowingAndFollowers} */}
      {/*  options={{ */}
      {/*    gestureResponseDistance, */}
      {/*    cardStyle: styles.followingAndFollowers, */}
      {/*  }} */}
      {/* /> */}

      {/* <Stack.Screen name={ROUTES.PROFILE_NFTS} component={ProfileNfts} /> */}

      {/* -------------- */}
      {/* --- MODALS --- */}
      {/* -------------- */}

      <Stack.Screen name={ROUTES.CONFIRM_MODAL} component={ConfirmModal} />
      <Stack.Screen name={ROUTES.TEXTONLY_MODAL} component={TextOnlyModal} />
      <Stack.Screen name={ROUTES.BOTTOM_MODAL} component={BottomModal} />

      <Stack.Screen name={ROUTES.CONVERTIBLE_POINTS_MODAL} component={ConvertiblePointsModal} />
      <Stack.Screen name={ROUTES.MANAGE_CONNECTIONS_MODAL} component={ManageConnectionsModal} />
      <Stack.Screen name={ROUTES.BACKUP_PHRASE_BOTTOM_MODAL} component={BackupPhraseBottomModal} />

      {/* ---------------------- */}
      {/* --- INVITE SCREENS --- */}
      {/* ---------------------- */}

      <Stack.Screen name={ROUTES.MANAGE_INVITES} component={ManageInvites} />
      <Stack.Screen name={ROUTES.IMPACT_POINTS_MODAL} component={ImpactPointsModal} />

      {/* ------------------------------ */}
      {/* TODO: Categorize these screens */}
      {/* ------------------------------ */}

      {/* <Stack.Screen name={ROUTES.GRANTS} component={Grants} /> */}
      {/* <Stack.Screen name={ROUTES.GRANTS_DETAILS} component={GrantsDetails} /> */}

      {/* <Stack.Screen name={ROUTES.OPERATIONS} component={Operations} /> */}

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
      {/*    name={ROUTES.ACTION_AUTHORIZATION} */}
      {/*    component={ActionAuthorization} */}
      {/*  /> */}

      {/* </Stack.Group> */}

      {/* <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
