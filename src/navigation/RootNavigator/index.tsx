import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import {NavigatorScreenParams, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  BottomSheetAndroid,
  ModalPresentationIOS,
} from '@react-navigation/stack/src/TransitionConfigs/TransitionPresets';
import inviteCodeState from '@recoil/inviteCodeState';
import EnvConfig from 'config/EnvConfig';
import useActiveAccount from 'hooks/useActiveAccount';
import useInitializeAppData from 'hooks/useInitializeAppData';
import useNotifications from 'hooks/useNotifications';
import {getMMKV, MMKVKEYS} from 'lib/MMKVStorage';
import AuthorizeWalletStack, {
  AuthorizeWalletParamList,
} from 'navigation/RootNavigator/AuthorizeWalletStack';
import BottomTabs, {
  BottomTabsParamList,
} from 'navigation/RootNavigator/BottomTabs';
import HomeTabs, {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import PostInteractionTabs, {
  PostInteractionTabsParamList,
} from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Dimensions, Platform, TextStyle, ViewStyle} from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import {useTheme} from 'react-native-paper';
import {useSetRecoilState} from 'recoil';
import ActionAuthorization, {
  ActionAuthorizationParams,
} from 'screens/ActionAuthorization';
import Activities from 'screens/Activities';
import AddProfile, {AddProfileParams} from 'screens/AddProfile';
import AddProfileSelectAddressAdvanced, {
  AddProfileSelectAddressAdvancedParams,
} from 'screens/AddProfileSelectAddress/Advanced';
import AddProfileSelectAddressGeneral, {
  AddProfileSelectAddressGeneralParams,
} from 'screens/AddProfileSelectAddress/General';
import GenerateAccount, {BroadcastTxParams} from 'screens/BroadcastTx';
import CheckMnemonic, {CheckMnemonicParams} from 'screens/CheckMnemonic';
import CommentReplies, {CommentRepliesParams} from 'screens/CommentReplies';
import Community from 'screens/Community';
import ConfirmAddress, {ConfirmAddressParams} from 'screens/ConfirmAddress';
import ConnectAddressAdvanced, {
  ConnectAddressAdvancedParams,
} from 'screens/ConnectAddress/Advanced';
import ConnectAddressGeneral, {
  ConnectAddressGeneralParams,
} from 'screens/ConnectAddress/General';
import ConnectApp from 'screens/ConnectApp';
import {ConnectAppParams} from 'screens/ConnectApp/useHooks';
import ConnectChainMethod from 'screens/ConnectChainMethod';
import ConnectChainTxDetail, {
  ConnectChainTxDetailParams,
} from 'screens/ConnectChainTxDetail';
import ConnectToLedger, {ConnectToLedgerParams} from 'screens/ConnectToLedger';
import CreateDesmosProfile from 'screens/CreateDesmosProfile';
import CreateTextPost from 'screens/CreateTextPost';
import DevScreen from 'screens/DEV';
import EditProfile from 'screens/EditProfile';
import EnterComment, {EnterCommentParams} from 'screens/EnterComment';
import {FollowingParams} from 'screens/Following';
import FollowingAndFollowers, {
  FollowingAndFollowersParams,
} from 'screens/FollowingAndFollowers';
import FullscreenStatusScreen, {
  FullscreenStatusScreenParams,
} from 'screens/FullscreenStatusScreen';
import Grants from 'screens/Grants';
import GrantsDetails, {GrantsDetailsParams} from 'screens/GrantsDetails';
import GuestProfile, {GuestProfileParams} from 'screens/GuestProfile';
import Invites from 'screens/Invites';
import Landing from 'screens/Landing';
import Login, {LoginParams} from 'screens/Login';
import LookingForDevices from 'screens/LookingForDevices';
import ManageBiometrics from 'screens/ManageBiometrics';
import ManageConnectedApps from 'screens/ManageConnectedApps';
import ManageConnectedChains from 'screens/ManageConnectedChains';
import ManageInvites from 'screens/ManageInvites';
import MnemonicInput, {
  MNEMONIC_INPUT_MODE,
  MnemonicInputParams,
} from 'screens/MnemonicInput';
import AddProfileModal, {
  AddProfileModalParams,
} from 'screens/Modals/AddProfileModal';
import BackupPhraseBottomModal from 'screens/Modals/BackupPhraseBottomModal';
import BottomModal, {BottomModalParams} from 'screens/Modals/BottomModal';
import ConfirmModal, {ConfirmModalParams} from 'screens/Modals/ConfirmModal';
import ConsentAgreement, {
  ConsentAgreementParams,
} from 'screens/Modals/ConsentAgreement';
import ConvertiblePointsModal from 'screens/Modals/ConvertiblePointsModal';
import DisconnectAppModal, {
  DisconnectAppParams,
} from 'screens/Modals/DisconnectAppModal';
import DisconnectChainModal, {
  DisconnectChainParams,
} from 'screens/Modals/DisconnectChainModal';
import ImpactPointsModal from 'screens/Modals/ImpactPointsModal';
import ReportPost, {ReportPostParams} from 'screens/Modals/ReportPost';
import SendTips, {SendTipsParams} from 'screens/Modals/SendTips';
import TextOnlyModal, {TextOnlyModalParams} from 'screens/Modals/TextOnlyModal';
import NftDetails, {NftDetailsParams} from 'screens/NftDetails';
import NoDtagFound from 'screens/NoDtagFound';
import Onboarding, {OnboardingParams} from 'screens/Onboarding';
import ChangePassword, {
  PASSWORD_MANIPULATION_MODE,
  PasswordManipulationParams,
} from 'screens/PasswordManipulation';
import PostDetails, {PostDetailsParams} from 'screens/PostDetails';
import PostTypeSelection from 'screens/PostTypeSelection';
import ManageConnectionsModal, {
  ManageConnectionsModalParams,
} from 'screens/Profile/components/ManageConnectionsModal';
import Operations, {
  OperationsParams,
} from 'screens/Profile/components/Operations';
import ProfileNfts from 'screens/ProfileNfts';
import ProfilePosts, {ProfilePostsTabsParams} from 'screens/ProfilePosts';
import {PostsTabParams} from 'screens/ProfilePosts/PostsTab';
import Profiles from 'screens/Profiles';
import RevealRecoveryPhrase from 'screens/RevealRecoveryPhrase';
import SelectChainConnection from 'screens/SelectChainConnection';
import SelectDtag, {SelectDtagParamList} from 'screens/SelectDtag';
import SelectLedgerApp from 'screens/SelectLedgerApp';
import SelectTweet, {SelectTweetParams} from 'screens/SelectTweet';
import Settings from 'screens/Settings';
import ShowRecoveryPhrase, {
  ShowSecretPhraseParams,
} from 'screens/ShowRecoveryPhrase';
import Signup from 'screens/Signup';
import SignupResult from 'screens/SignupResult';
import WelcomeBack from 'screens/WelcomeBack';
import WelcomePage from 'screens/WelcomePage';
import useSubscriptions from 'hooks/useSubscriptions';

export type RootNavigatorParamList = {
  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;
  [ROUTES.LOGIN]: LoginParams | undefined;
  [ROUTES.MANAGE_CONNECTED_CHAINS]: undefined;
  [ROUTES.MANAGE_CONNECTED_APPS]: undefined;
  [ROUTES.LANDING]: undefined;
  [ROUTES.SIGNUP]: undefined;
  [ROUTES.SIGNUP_RESULT]: undefined;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  [ROUTES.SETTINGS]: undefined;
  [ROUTES.LOOKING_FOR_DEVICES]: undefined;
  [ROUTES.CONNECT_TO_LEDGER]: ConnectToLedgerParams;
  [ROUTES.HOME_TABS]: NavigatorScreenParams<HomeTabsParamList>;
  [ROUTES.GUEST_PROFILE]: GuestProfileParams | undefined;
  [ROUTES.SETTINGS_PROFILES]: undefined;
  [ROUTES.SETTINGS_COMMUNITY]: undefined;
  [ROUTES.MNEMONIC_INPUT]: MnemonicInputParams;
  [ROUTES.SETTINGS_REVEAL_SECRET_PHRASE]: undefined;
  [ROUTES.SETTINGS_SHOW_SECRET_PHRASE]: ShowSecretPhraseParams;
  [ROUTES.SELECT_DTAG]: SelectDtagParamList;
  [ROUTES.CHECK_MNEMONIC]: CheckMnemonicParams;
  [ROUTES.CONSENT_AGREEMENT]: ConsentAgreementParams;
  [ROUTES.WELCOME_PAGE]: undefined;
  [ROUTES.FULLSCREEN_STATUS_SCREEN]: FullscreenStatusScreenParams;
  [ROUTES.BOTTOM_MODAL]: BottomModalParams;
  [ROUTES.NO_DTAG_FOUND]: undefined;
  [ROUTES.BROADCAST_TX]: BroadcastTxParams;
  [ROUTES.CREATE_DESMOS_PROFILE]: undefined;
  [ROUTES.WELCOME_BACK]: undefined;
  [ROUTES.SELECT_LEDGER_APP]: undefined;
  [ROUTES.CONNECT_ADDRESS_GENERAL]: ConnectAddressGeneralParams | undefined;
  [ROUTES.CONNECT_ADDRESS_ADVANCED]: ConnectAddressAdvancedParams | undefined;
  [ROUTES.CONFIRM_ADDRESS]: ConfirmAddressParams;
  [ROUTES.CONNECT_CHAIN_METHOD]: undefined;
  [ROUTES.DISCONNECT_CHAIN_MODAL]: DisconnectChainParams;
  [ROUTES.SELECT_CHAIN]: undefined;
  [ROUTES.SEND_TIPS]: SendTipsParams;
  [ROUTES.REPORT_POST]: ReportPostParams;
  [ROUTES.CONNECT_CHAIN_TX_DETAIL]: ConnectChainTxDetailParams;
  [ROUTES.ACTION_AUTHORIZATION]: ActionAuthorizationParams;
  [ROUTES.POST_DETAILS]: PostDetailsParams;
  [ROUTES.ENTER_COMMENT]: EnterCommentParams;
  [ROUTES.SELECT_POST_TYPE]: undefined;
  [ROUTES.CREATE_TEXT_POST]: undefined;
  [ROUTES.COMMENT_REPLIES]: CommentRepliesParams;
  [ROUTES.EDIT_PROFILE]: undefined;
  [ROUTES.MANAGE_BIOMETRICS]: undefined;

  // Nested navigators
  [ROUTES.AUTHORIZE_WALLET]: NavigatorScreenParams<AuthorizeWalletParamList>;

  // Post interaction tabs
  [ROUTES.POST_INTERACTION]: NavigatorScreenParams<PostInteractionTabsParamList>;

  // Bottom tabs
  [ROUTES.BOTTOM_TABS]: NavigatorScreenParams<BottomTabsParamList>;

  // only for dev
  [ROUTES.DEV_SCREEN]: undefined;

  /* Following and followers route. */
  [ROUTES.FOLLOWING_AND_FOLLOWERS]: NavigatorScreenParams<FollowingAndFollowersParams>;

  /* Following tab route. */
  [ROUTES.FOLLOWING]: FollowingParams;

  /* Followers tab route. */
  [ROUTES.FOLLOWERS]: FollowingParams;

  /* Counters Params */
  // marked for deletion (unused/belongs under ROUTES.POST_INTERACTION
  // [ROUTES.POST_REACTIONS]: PostInteractionReactionsTabsParams;
  // [ROUTES.POST_TIPS]: PostInteractionTipsTabsParams;

  // Profile posts
  [ROUTES.PROFILE_POSTS]: ProfilePostsTabsParams;
  [ROUTES.PROFILE_POSTS_POSTS]: PostsTabParams;
  [ROUTES.PROFILE_POSTS_LIKED]: PostsTabParams;
  [ROUTES.PROFILE_POSTS_TIPPED]: PostsTabParams;

  // Nfts
  [ROUTES.PROFILE_NFTS]: undefined;
  [ROUTES.NFT_DETAILS]: NftDetailsParams;

  // Add profile
  [ROUTES.ADD_PROFILE]: AddProfileParams;
  [ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL]: AddProfileSelectAddressGeneralParams;
  [ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED]: AddProfileSelectAddressAdvancedParams;
  [ROUTES.ADD_PROFILE_MODAL]: AddProfileModalParams;

  /* Apps and Twitter */
  [ROUTES.CONNECT_APP]: ConnectAppParams;
  [ROUTES.SELECT_TWEET]: SelectTweetParams;
  [ROUTES.DISCONNECT_APP_MODAL]: DisconnectAppParams;

  // Activities
  [ROUTES.ACTIVITIES]: undefined;

  // Grants
  [ROUTES.GRANTS]: undefined;
  [ROUTES.GRANTS_DETAILS]: GrantsDetailsParams;

  // Invites
  [ROUTES.INVITES]: undefined;
  [ROUTES.MANAGE_INVITES]: undefined;
  [ROUTES.IMPACT_POINTS_MODAL]: undefined;

  // Onboarding
  [ROUTES.ONBOARDING]: OnboardingParams;

  // New profile
  [ROUTES.MANAGE_CONNECTIONS_MODAL]: ManageConnectionsModalParams;
  [ROUTES.CONVERTIBLE_POINTS_MODAL]: undefined;
  [ROUTES.OPERATIONS]: OperationsParams;
};

const NativeTransition = Platform.select({
  ios: ModalPresentationIOS,
  default: BottomSheetAndroid,
});

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  const {navigate} = useNavigation<any>();
  const {activeAddress} = useActiveAccount();
  const setInviteCode = useSetRecoilState(inviteCodeState);
  // Initialization. Move to Landing page once ready.
  useInitializeAppData();
  useNotifications();
  // End initialization

  // Start subscriptions
  useSubscriptions();

  const {t} = useTranslation();

  const handleDynamicLink = (link: FirebaseDynamicLinksTypes.DynamicLink) => {
    if (link && !activeAddress) {
      const inviteCode = link.url.substring(link.url.indexOf('=') + 1);
      Alert.alert('You received an invite!', `${inviteCode}`);
      setInviteCode(inviteCode);
      navigate(ROUTES.ONBOARDING, {invited: true});
    } else {
      if (link && activeAddress) {
        Alert.alert('Error', 'Your already have an account');
      }
    }
  };

  useEffect(() => {
    // Hide the splashscreen
    RNBootSplash.hide({fade: true});

    // Listen to Firebase dynamic links, foreground and background modes
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link && !activeAddress) {
          const inviteCode = link.url.substring(link.url.indexOf('=') + 1);
          Alert.alert('You received an invite!', `${inviteCode}`);
          setInviteCode(inviteCode);
          navigate(ROUTES.ONBOARDING, {invited: true});
        } else {
          if (link && activeAddress) {
            Alert.alert('Error', 'Your already have an account');
          }
        }
      });
    // Clear the subscription
    return () => unsubscribe();
  }, []);

  /* To allow going back to previous screen via swipe left. */
  const {height, width} = Dimensions.get('window');
  const gestureResponseDistance = Math.max(height, width);

  const initialRouteName = React.useMemo(() => {
    if (__DEV__) return ROUTES.DEV_SCREEN;
    const activeAddr = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDR);

    if (activeAddr) {
      return ROUTES.BOTTOM_TABS;
    }
    return ROUTES.ONBOARDING;
  }, []);

  const theme = useTheme();
  const styles: {[key: string]: ViewStyle | TextStyle} = {
    followingAndFollowers: {
      backgroundColor: theme.colors.white,
    },
    addProfileCard: {
      backgroundColor: 'rgb(245,246,249)',
    },
    statusScreen: {
      backgroundColor: 'rgb(175,175,175)',
    },
  };

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
      }}>
      {__DEV__ && (
        <Stack.Screen name={ROUTES.DEV_SCREEN} component={DevScreen} />
      )}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />

      <Stack.Screen name={ROUTES.LOGIN} component={Login} />

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
        options={{cardStyle: styles.statusScreen}}
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
      <Stack.Screen name={ROUTES.SIGNUP_RESULT} component={SignupResult} />
      <Stack.Screen
        initialParams={{
          mode: MNEMONIC_INPUT_MODE.IMPORT_RECOVERY_PHRASE,
        }}
        name={ROUTES.MNEMONIC_INPUT}
        component={MnemonicInput}
      />
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
      <Stack.Screen name={ROUTES.BOTTOM_TABS} component={BottomTabs} />
      <Stack.Screen
        initialParams={{
          postId: 1,
        }}
        name={ROUTES.POST_DETAILS}
        component={PostDetails}
      />
      <Stack.Screen
        initialParams={{
          commentId: 1,
          subspaceId: EnvConfig.APP_SUBSPACE_ID,
        }}
        name={ROUTES.COMMENT_REPLIES}
        component={CommentReplies}
      />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_CHAINS}
        component={ManageConnectedChains}
      />
      <Stack.Screen
        name={ROUTES.MANAGE_CONNECTED_APPS}
        component={ManageConnectedApps}
      />
      <Stack.Screen
        name={ROUTES.MANAGE_BIOMETRICS}
        component={ManageBiometrics}
      />
      <Stack.Screen name={ROUTES.GUEST_PROFILE} component={GuestProfile} />
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
        name={ROUTES.SELECT_LEDGER_APP}
        component={SelectLedgerApp}
      />

      <Stack.Screen
        name={ROUTES.CONNECT_ADDRESS_GENERAL}
        component={ConnectAddressGeneral}
      />

      <Stack.Screen
        name={ROUTES.CONNECT_ADDRESS_ADVANCED}
        component={ConnectAddressAdvanced}
      />

      <Stack.Screen name={ROUTES.CONNECT_APP} component={ConnectApp} />

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

      <Stack.Screen
        name={ROUTES.CONNECT_CHAIN_METHOD}
        component={ConnectChainMethod}
      />

      <Stack.Screen name={ROUTES.ENTER_COMMENT} component={EnterComment} />

      <Stack.Screen
        name={ROUTES.SELECT_POST_TYPE}
        component={PostTypeSelection}
      />

      <Stack.Screen name={ROUTES.CREATE_TEXT_POST} component={CreateTextPost} />

      <Stack.Screen name={ROUTES.SELECT_TWEET} component={SelectTweet} />

      <Stack.Screen name={ROUTES.EDIT_PROFILE} component={EditProfile} />

      <Stack.Screen name={ROUTES.GRANTS} component={Grants} />

      <Stack.Screen name={ROUTES.GRANTS_DETAILS} component={GrantsDetails} />

      <Stack.Screen name={ROUTES.ACTIVITIES} component={Activities} />

      <Stack.Screen name={ROUTES.INVITES} component={Invites} />

      <Stack.Screen name={ROUTES.MANAGE_INVITES} component={ManageInvites} />

      <Stack.Screen
        name={ROUTES.ONBOARDING}
        component={Onboarding}
        initialParams={{invited: false}}
      />

      <Stack.Screen name={ROUTES.OPERATIONS} component={Operations} />

      {/* modals */}
      <Stack.Group
        screenOptions={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
          ...NativeTransition,
        }}>
        <Stack.Screen
          name={ROUTES.CONSENT_AGREEMENT}
          component={ConsentAgreement}
        />
        <Stack.Screen
          name={ROUTES.CONFIRM_MODAL}
          component={ConfirmModal}
          // initialParams={{
          //   title: 'Success',
          //   subtitle: 'Your Twitter account is successfully connected',
          //   primaryButtonLabel: 'Go to Profile',
          //   // secondaryButtonLabel: 'Go to Profile',
          //   image: modalSuccess,
          // }}
        />
        <Stack.Screen name={ROUTES.SEND_TIPS} component={SendTips} />
        <Stack.Screen name={ROUTES.REPORT_POST} component={ReportPost} />
        <Stack.Screen name={ROUTES.BOTTOM_MODAL} component={BottomModal} />
        <Stack.Screen
          name={ROUTES.MANAGE_CONNECTIONS_MODAL}
          component={ManageConnectionsModal}
        />
        <Stack.Screen
          name={ROUTES.IMPACT_POINTS_MODAL}
          component={ImpactPointsModal}
        />
        <Stack.Screen
          name={ROUTES.CONVERTIBLE_POINTS_MODAL}
          component={ConvertiblePointsModal}
        />
        <Stack.Screen
          name={ROUTES.ADD_PROFILE_MODAL}
          component={AddProfileModal}
        />

        <Stack.Screen
          name={ROUTES.BACKUP_PHRASE_BOTTOM_MODAL}
          component={BackupPhraseBottomModal}
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
          name={ROUTES.DISCONNECT_APP_MODAL}
          component={DisconnectAppModal}
        />

        <Stack.Screen
          name={ROUTES.ACTION_AUTHORIZATION}
          component={ActionAuthorization}
        />

        <Stack.Screen
          name={ROUTES.POST_INTERACTION}
          component={PostInteractionTabs}
        />
      </Stack.Group>

      {/* modals end */}

      <Stack.Screen
        name={ROUTES.AUTHORIZE_WALLET}
        component={AuthorizeWalletStack}
      />

      <Stack.Screen
        name={ROUTES.FOLLOWING_AND_FOLLOWERS}
        component={FollowingAndFollowers}
        options={{
          gestureResponseDistance,
          cardStyle: styles.followingAndFollowers,
        }}
      />

      <Stack.Screen
        name={ROUTES.PROFILE_POSTS}
        component={ProfilePosts}
        options={{
          gestureResponseDistance,
        }}
      />

      <Stack.Screen name={ROUTES.PROFILE_NFTS} component={ProfileNfts} />
      <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} />

      <Stack.Screen name={ROUTES.ADD_PROFILE} component={AddProfile} />
      <Stack.Screen
        name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_GENERAL}
        component={AddProfileSelectAddressGeneral}
      />
      <Stack.Screen
        name={ROUTES.ADD_PROFILE_SELECT_ADDRESS_ADVANCED}
        component={AddProfileSelectAddressAdvanced}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
