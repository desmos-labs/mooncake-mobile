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

export type RootNavigatorParamList = {
  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;
  // [ROUTES.LOGIN]: LoginParams | undefined;
  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;
  [ROUTES.MANAGE_CONNECTED_APPS]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_MODE]: undefined;
  [ROUTES.SIGNUP]: undefined;
  // [ROUTES.SIGNUP_RESULT]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT]: SaveAccountParams;
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;
  [ROUTES.CONNECT_TO_LEDGER_STACK]: ConnectToLedgerStackParams;
  // [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.HOME_TABS]: NavigatorScreenParams<HomeTabsParamList>;
  // [ROUTES.GUEST_PROFILE]: GuestProfileParams | undefined;
  // [ROUTES.SETTINGS_PROFILES]: undefined;
  // [ROUTES.SETTINGS_COMMUNITY]: undefined;
  [ROUTES.MNEMONIC_INPUT]: undefined;
  // [ROUTES.SETTINGS_REVEAL_SECRET_PHRASE]: undefined;
  // [ROUTES.SETTINGS_SHOW_SECRET_PHRASE]: ShowSecretPhraseParams;
  [ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT]: SelectAccountParamList;
  // [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.CONSENT_AGREEMENT]: ConsentAgreementParams;
  // [ROUTES.FULLSCREEN_STATUS_SCREEN]: FullscreenStatusScreenParams;
  // [ROUTES.BOTTOM_MODAL]: BottomModalParams;
  // [ROUTES.NO_DTAG_FOUND]: undefined;
  [ROUTES.BROADCAST_TX_ON_CHAIN]: BroadcastTxParams;
  [ROUTES.WELCOME_BACK]: undefined;
  [ROUTES.SELECT_LEDGER_APP]: undefined;
  // [ROUTES.CONNECT_ADDRESS_GENERAL]: ConnectAddressGeneralParams | undefined;
  // [ROUTES.CONNECT_ADDRESS_ADVANCED]: ConnectAddressAdvancedParams | undefined;
  // [ROUTES.CONFIRM_ADDRESS]: ConfirmAddressParams;
  // [ROUTES.CONNECT_CHAIN_METHOD]: undefined;
  [ROUTES.DISCONNECT_CHAIN_MODAL]: DisconnectChainParams;
  [ROUTES.SEND_TIPS]: SendTipsParams;
  [ROUTES.REPORT_POST]: ReportPostParams;
  // [ROUT     ES.CONNECT_CHAIN_TX_DETAIL]: ConnectChainTxDetailParams;
  // [ROUTES.ACTION_AUTHORIZATION]: ActionAuthorizationParams;
  [ROUTES.POST_DETAILS]: PostDetailsParams;
  [ROUTES.CREATE_POST]: CreatePostParams | undefined;
  // [ROUTES.SELECT_POST_TYPE]: undefined;
  // [ROUTES.CREATE_TEXT_POST]: undefined;
  [ROUTES.SAVE_PROFILE]: SaveProfileParams | undefined;
  [ROUTES.MANAGE_BIOMETRICS]: undefined;

  // Nested navigators
  // [ROUTES.AUTHORIZE_WALLET]: NavigatorScreenParams<AuthorizeWalletParamList>;

  // Post interaction tabs
  [ROUTES.POST_INTERACTION]: NavigatorScreenParams<PostInteractionTabsParamList>;

  // Bottom tabs
  [ROUTES.BOTTOM_TABS]: NavigatorScreenParams<BottomTabsParamList>;

  // only for dev
  [ROUTES.DEV_SCREEN]: undefined;

  // Following and followers route.
  // [ROUTES.FOLLOWING_AND_FOLLOWERS]: NavigatorScreenParams<FollowingAndFollowersParams>;

  // Following tab route.
  // [ROUTES.FOLLOWING]: FollowingParams;

  // Followers tab route.
  // [ROUTES.FOLLOWERS]: FollowingParams;

  // Counters Params
  // marked for deletion (unused/belongs under ROUTES.POST_INTERACTION
  [ROUTES.POST_REACTIONS]: PostInteractionReactionsTabParams;
  // [ROUTES.POST_TIPS]: PostInteractionTipsTabsParams;

  // Profile posts
  // [ROUTES.PROFILE_POSTS]: ProfilePostsTabsParams;
  // [ROUTES.PROFILE_POSTS_POSTS]: PostsTabParams;
  // [ROUTES.PROFILE_POSTS_LIKED]: PostsTabParams;
  // [ROUTES.PROFILE_POSTS_TIPPED]: PostsTabParams;

  // Nfts
  // [ROUTES.PROFILE_NFTS]: undefined;
  // [ROUTES.NFT_DETAILS]: NftDetailsParams;

  // Add profile
  // [ROUTES.ADD_PROFILE]: AddProfileParams;
  // [ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL]: AddProfileSelectAddressGeneralParams;
  // [ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED]: AddProfileSelectAddressAdvancedParams;
  // [ROUTES.ADD_PROFILE_MODAL]: AddProfileModalParams;

  // Apps and Twitter
  // [ROUTES.CONNECT_APP]: ConnectAppParams;
  // [ROUTES.SELECT_TWEET]: SelectTweetParams;
  [ROUTES.DISCONNECT_APP_MODAL]: DisconnectAppParams;

  // Activities
  // [ROUTES.ACTIVITIES]: undefined;

  // Grants
  // [ROUTES.GRANTS]: undefined;
  // [ROUTES.GRANTS_DETAILS]: GrantsDetailsParams;

  // Invites
  // [ROUTES.INVITES]: undefined;
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
      {__DEV__ && <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN}
        component={ImportAccountSelectChain}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_MODE} component={ImportAccountSelectMode} />

      {/* <Stack.Screen name={ROUTES.LOGIN} component={Login} /> */}

      <Stack.Screen name={ROUTES.WELCOME_BACK} component={WelcomeBack} />
      {/* <Stack.Screen name={ROUTES.NO_DTAG_FOUND} component={NoDtagFound} /> */}
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SELECT_ACCOUNT} component={SelectAccount} />

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
      <Stack.Screen name={ROUTES.SIGNUP} component={Signup} />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT} component={SaveAccount} />
      <Stack.Screen name={ROUTES.CONNECT_TO_LEDGER_STACK} component={ConnectToLedgerStack} />
      <Stack.Screen name={ROUTES.MNEMONIC_INPUT} component={MnemonicInput} />
      <Stack.Screen name={ROUTES.UNLOCK_WALLET} component={UnlockWallet} />
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.BOTTOM_TABS} component={BottomTabs} />
      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
      <Stack.Screen name={ROUTES.POST_DETAILS} component={PostDetails} />
      <Stack.Screen name={ROUTES.MANAGE_CONNECTED_CHAINS} component={ManageConnectedChains} />
      <Stack.Screen name={ROUTES.MANAGE_CONNECTED_APPS} component={ManageConnectedApps} />
      {/* <Stack.Screen */}
      {/*  name={ROUTES.MANAGE_BIOMETRICS} */}
      {/*  component={ManageBiometrics} */}
      {/* /> */}
      {/* <Stack.Screen name={ROUTES.GUEST_PROFILE} component={GuestProfile} /> */}
      {/* <Stack.Screen name={ROUTES.SETTINGS_PROFILES} component={Profiles} /> */}
      {/* <Stack.Screen name={ROUTES.SETTINGS_COMMUNITY} component={Community} /> */}
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
      {/*  name={ROUTES.SETTINGS_REVEAL_SECRET_PHRASE} */}
      {/*  component={RevealRecoveryPhrase} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.SETTINGS_SHOW_SECRET_PHRASE} */}
      {/*  component={ShowRecoveryPhrase} */}
      {/* /> */}
      <Stack.Screen name={ROUTES.SELECT_LEDGER_APP} component={SelectLedgerApp} />
      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_ADDRESS_GENERAL} */}
      {/*  component={ConnectAddressGeneral} */}
      {/* /> */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.CONNECT_ADDRESS_ADVANCED} */}
      {/*  component={ConnectAddressAdvanced} */}
      {/* /> */}

      {/* <Stack.Screen name={ROUTES.CONNECT_APP} component={ConnectApp} /> */}

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

      <Stack.Screen name={ROUTES.CREATE_POST} component={CreatePost} />

      {/* <Stack.Screen name={ROUTES.CREATE_TEXT_POST} component={CreateTextPost} /> */}

      {/* <Stack.Screen name={ROUTES.SELECT_TWEET} component={SelectTweet} /> */}

      <Stack.Screen name={ROUTES.SAVE_PROFILE} component={SaveProfile} />

      {/* <Stack.Screen name={ROUTES.GRANTS} component={Grants} /> */}

      {/* <Stack.Screen name={ROUTES.GRANTS_DETAILS} component={GrantsDetails} /> */}

      {/* <Stack.Screen name={ROUTES.ACTIVITIES} component={Activities} /> */}

      {/* <Stack.Screen name={ROUTES.INVITES} component={Invites} /> */}

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
      <Stack.Screen name={ROUTES.REPORT_POST} component={ReportPost} />
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
      {/*  <Stack.Screen */}
      {/*    name={ROUTES.ADD_PROFILE_MODAL} */}
      {/*    component={AddProfileModal} */}
      {/*  /> */}

      <Stack.Screen name={ROUTES.BACKUP_PHRASE_BOTTOM_MODAL} component={BackupPhraseBottomModal} />
      <Stack.Screen name={ROUTES.TEXTONLY_MODAL} component={TextOnlyModal} />
      <Stack.Screen name={ROUTES.CONSENT_AGREEMENT} component={ConsentAgreement} />
      <Stack.Screen name={ROUTES.DISCONNECT_CHAIN_MODAL} component={DisconnectChainModal} />
      <Stack.Screen name={ROUTES.DISCONNECT_APP_MODAL} component={DisconnectAppModal} />

      {/*  <Stack.Screen */}
      {/*    name={ROUTES.ACTION_AUTHORIZATION} */}
      {/*    component={ActionAuthorization} */}
      {/*  /> */}

      <Stack.Screen name={ROUTES.POST_INTERACTION} component={PostInteractionTabs} />
      {/* </Stack.Group> */}

      {/* /!* modals end *!/ */}

      {/* <Stack.Screen */}
      {/*  name={ROUTES.AUTHORIZE_WALLET} */}
      {/*  component={AuthorizeWalletStack} */}
      {/* /> */}

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

      {/* <Stack.Screen name={ROUTES.PROFILE_NFTS} component={ProfileNfts} /> */}
      {/* <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} /> */}

      {/* <Stack.Screen name={ROUTES.ADD_PROFILE} component={AddProfile} /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL} */}
      {/*  component={AddProfileSelectAddressGeneral} */}
      {/* /> */}
      {/* <Stack.Screen */}
      {/*  name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED} */}
      {/*  component={AddProfileSelectAddressAdvanced} */}
      {/* /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
