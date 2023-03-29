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
import ImportAccountSelectProfile, {
  SelectAccountParamList,
} from 'screens/ImportAccountSelectProfile';
import ConsentAgreement, { ConsentAgreementParams } from 'screens/Modals/ConsentAgreement';
import ImportAccountSelectMode from 'screens/ImportAccountSelectMode';
import SaveAccount, { SaveAccountParams } from 'screens/SaveAccount';
import ChangePassword, { PasswordManipulationParams } from 'screens/PasswordManipulation';
import ConnectToLedgerStack, {
  ConnectToLedgerStackParams,
} from 'navigation/RootNavigator/ConnectToLedgerStack';
import HomeTabs, { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
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
import { Dimensions, Platform } from 'react-native';
import ProfileConnections, {
  ProfileConnectionsParams,
  ProfileConnectionsTabParams,
} from 'screens/ProfileConnections';
import ProfileOperations, { ProfileOperationsParams } from 'screens/ProfileOperations';
import SelectTweet, { SelectTweetParams } from 'screens/SelectTweet';
import Login, { LoginParams } from 'screens/Login';
import UploadProfilePicturesModal, {
  SaveProfileModalParams,
} from 'screens/Modals/UploadProfilePicturesModal';
import {
  BottomSheetAndroid,
  ModalPresentationIOS,
} from '@react-navigation/stack/src/TransitionConfigs/TransitionPresets';
import AuthorizationModal, { AuthorizationModalParams } from 'screens/Modals/AuthorizationModal';

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
  [ROUTES.LOGIN]: LoginParams | undefined;
  [ROUTES.WELCOME]: undefined;

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.IMPORT_ACCOUNT_SELECT_CHAIN]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_MODE]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_LEDGER_APP]: undefined;
  [ROUTES.IMPORT_ACCOUNT_MNEMONIC_INPUT]: undefined;
  [ROUTES.IMPORT_ACCOUNT_SELECT_PROFILE]: SelectAccountParamList;
  [ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT]: SaveAccountParams;

  [ROUTES.PASSWORD_MANIPULATION]: PasswordManipulationParams;

  // -------------------------------------------------------------------------------------
  // --- HOME SCREENS
  // -------------------------------------------------------------------------------------

  // Bottom tabs
  [ROUTES.BOTTOM_TABS]: NavigatorScreenParams<BottomTabsParamList>;
  [ROUTES.ACTIVITIES]: undefined;

  // Home page
  [ROUTES.HOME_TABS]: HomeTabsParams;

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
  [ROUTES.SELECT_TWEET]: SelectTweetParams;

  // -------------------------------------------------------------------------------------
  // --- PROFILE SCREENS
  // -------------------------------------------------------------------------------------

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

  // Profile past operations
  [ROUTES.PROFILE_OPERATIONS]: ProfileOperationsParams;

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
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.MANAGE_CONNECTIONS_MODAL]: ManageConnectionsModalParams;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.UPLOAD_PROFILE_PICTURES_MODALS]: SaveProfileModalParams;
  [ROUTES.AUTHORIZATION_MODAL]: AuthorizationModalParams;

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

  const initialRouteName = React.useMemo(() => {
    if (__DEV__) return ROUTES.DEV_SCREEN;
    const activeAddr = getMMKV<string>(MMKVKEYS.ACTIVE_ACCOUNT_ADDRESS);

    if (activeAddr) {
      return ROUTES.BOTTOM_TABS;
    }
    return ROUTES.ONBOARDING;
  }, []);

  const NativeTransition = Platform.select({
    ios: ModalPresentationIOS,
    default: BottomSheetAndroid,
  });

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
      <Stack.Screen name={ROUTES.LOGIN} component={Login} />

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
        name={ROUTES.IMPORT_ACCOUNT_SELECT_PROFILE}
        component={ImportAccountSelectProfile}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT} component={SaveAccount} />

      <Stack.Screen name={ROUTES.PASSWORD_MANIPULATION} component={ChangePassword} />

      {/* ------------------------------------ */}
      {/* --- BROADCAST TRANSACTION SCREEN --- */}
      {/* ------------------------------------ */}

      <Stack.Screen
        name={ROUTES.BROADCAST_TX_ON_CHAIN}
        component={BroadcastTxOnChain}
        initialParams={{
          messages: [
            {
              typeUrl: '/cosmos.feegrant.v1beta1.MsgRevokeAllowance',
              value: {
                granter: 'desmos1f5067xm2f65vjalkm55nn5v0s40nyh43lemwwp',
                grantee: 'desmos1g594acavk4mf77v36pvdux8ex7kg427y03mn2c',
              },
            },
            {
              typeUrl: '/cosmos.feegrant.v1beta1.MsgGrantAllowance',
              value: {
                granter: 'desmos1f5067xm2f65vjalkm55nn5v0s40nyh43lemwwp',
                grantee: 'desmos1g594acavk4mf77v36pvdux8ex7kg427y03mn2c',
                allowance: {
                  typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
                  value: {
                    '0': 10,
                    '1': 41,
                    '2': 10,
                    '3': 39,
                    '4': 47,
                    '5': 99,
                    '6': 111,
                    '7': 115,
                    '8': 109,
                    '9': 111,
                    '10': 115,
                    '11': 46,
                    '12': 102,
                    '13': 101,
                    '14': 101,
                    '15': 103,
                    '16': 114,
                    '17': 97,
                    '18': 110,
                    '19': 116,
                    '20': 46,
                    '21': 118,
                    '22': 49,
                    '23': 98,
                    '24': 101,
                    '25': 116,
                    '26': 97,
                    '27': 49,
                    '28': 46,
                    '29': 66,
                    '30': 97,
                    '31': 115,
                    '32': 105,
                    '33': 99,
                    '34': 65,
                    '35': 108,
                    '36': 108,
                    '37': 111,
                    '38': 119,
                    '39': 97,
                    '40': 110,
                    '41': 99,
                    '42': 101,
                    '43': 18,
                    '44': 34,
                    '45': 47,
                    '46': 100,
                    '47': 101,
                    '48': 115,
                    '49': 109,
                    '50': 111,
                    '51': 115,
                    '52': 46,
                    '53': 112,
                    '54': 114,
                    '55': 111,
                    '56': 102,
                    '57': 105,
                    '58': 108,
                    '59': 101,
                    '60': 115,
                    '61': 46,
                    '62': 118,
                    '63': 51,
                    '64': 46,
                    '65': 77,
                    '66': 115,
                    '67': 103,
                    '68': 83,
                    '69': 97,
                    '70': 118,
                    '71': 101,
                    '72': 80,
                    '73': 114,
                    '74': 111,
                    '75': 102,
                    '76': 105,
                    '77': 108,
                    '78': 101,
                    '79': 18,
                    '80': 30,
                    '81': 47,
                    '82': 100,
                    '83': 101,
                    '84': 115,
                    '85': 109,
                    '86': 111,
                    '87': 115,
                    '88': 46,
                    '89': 112,
                    '90': 111,
                    '91': 115,
                    '92': 116,
                    '93': 115,
                    '94': 46,
                    '95': 118,
                    '96': 50,
                    '97': 46,
                    '98': 77,
                    '99': 115,
                    '100': 103,
                    '101': 67,
                    '102': 114,
                    '103': 101,
                    '104': 97,
                    '105': 116,
                    '106': 101,
                    '107': 80,
                    '108': 111,
                    '109': 115,
                    '110': 116,
                    '111': 18,
                    '112': 37,
                    '113': 47,
                    '114': 100,
                    '115': 101,
                    '116': 115,
                    '117': 109,
                    '118': 111,
                    '119': 115,
                    '120': 46,
                    '121': 112,
                    '122': 111,
                    '123': 115,
                    '124': 116,
                    '125': 115,
                    '126': 46,
                    '127': 118,
                    '128': 50,
                    '129': 46,
                    '130': 77,
                    '131': 115,
                    '132': 103,
                    '133': 65,
                    '134': 100,
                    '135': 100,
                    '136': 80,
                    '137': 111,
                    '138': 115,
                    '139': 116,
                    '140': 65,
                    '141': 116,
                    '142': 116,
                    '143': 97,
                    '144': 99,
                    '145': 104,
                    '146': 109,
                    '147': 101,
                    '148': 110,
                    '149': 116,
                    '150': 18,
                    '151': 40,
                    '152': 47,
                    '153': 100,
                    '154': 101,
                    '155': 115,
                    '156': 109,
                    '157': 111,
                    '158': 115,
                    '159': 46,
                    '160': 112,
                    '161': 111,
                    '162': 115,
                    '163': 116,
                    '164': 115,
                    '165': 46,
                    '166': 118,
                    '167': 50,
                    '168': 46,
                    '169': 77,
                    '170': 115,
                    '171': 103,
                    '172': 82,
                    '173': 101,
                    '174': 109,
                    '175': 111,
                    '176': 118,
                    '177': 101,
                    '178': 80,
                    '179': 111,
                    '180': 115,
                    '181': 116,
                    '182': 65,
                    '183': 116,
                    '184': 116,
                    '185': 97,
                    '186': 99,
                    '187': 104,
                    '188': 109,
                    '189': 101,
                    '190': 110,
                    '191': 116,
                    '192': 18,
                    '193': 30,
                    '194': 47,
                    '195': 100,
                    '196': 101,
                    '197': 115,
                    '198': 109,
                    '199': 111,
                    '200': 115,
                    '201': 46,
                    '202': 112,
                    '203': 111,
                    '204': 115,
                    '205': 116,
                    '206': 115,
                    '207': 46,
                    '208': 118,
                    '209': 50,
                    '210': 46,
                    '211': 77,
                    '212': 115,
                    '213': 103,
                    '214': 68,
                    '215': 101,
                    '216': 108,
                    '217': 101,
                    '218': 116,
                    '219': 101,
                    '220': 80,
                    '221': 111,
                    '222': 115,
                    '223': 116,
                    '224': 18,
                    '225': 46,
                    '226': 47,
                    '227': 100,
                    '228': 101,
                    '229': 115,
                    '230': 109,
                    '231': 111,
                    '232': 115,
                    '233': 46,
                    '234': 114,
                    '235': 101,
                    '236': 108,
                    '237': 97,
                    '238': 116,
                    '239': 105,
                    '240': 111,
                    '241': 110,
                    '242': 115,
                    '243': 104,
                    '244': 105,
                    '245': 112,
                    '246': 115,
                    '247': 46,
                    '248': 118,
                    '249': 49,
                    '250': 46,
                    '251': 77,
                    '252': 115,
                    '253': 103,
                    '254': 67,
                    '255': 114,
                    '256': 101,
                    '257': 97,
                    '258': 116,
                    '259': 101,
                    '260': 82,
                    '261': 101,
                    '262': 108,
                    '263': 97,
                    '264': 116,
                    '265': 105,
                    '266': 111,
                    '267': 110,
                    '268': 115,
                    '269': 104,
                    '270': 105,
                    '271': 112,
                    '272': 18,
                    '273': 46,
                    '274': 47,
                    '275': 100,
                    '276': 101,
                    '277': 115,
                    '278': 109,
                    '279': 111,
                    '280': 115,
                    '281': 46,
                    '282': 114,
                    '283': 101,
                    '284': 108,
                    '285': 97,
                    '286': 116,
                    '287': 105,
                    '288': 111,
                    '289': 110,
                    '290': 115,
                    '291': 104,
                    '292': 105,
                    '293': 112,
                    '294': 115,
                    '295': 46,
                    '296': 118,
                    '297': 49,
                    '298': 46,
                    '299': 77,
                    '300': 115,
                    '301': 103,
                    '302': 68,
                    '303': 101,
                    '304': 108,
                    '305': 101,
                    '306': 116,
                    '307': 101,
                    '308': 82,
                    '309': 101,
                    '310': 108,
                    '311': 97,
                    '312': 116,
                    '313': 105,
                    '314': 111,
                    '315': 110,
                    '316': 115,
                    '317': 104,
                    '318': 105,
                    '319': 112,
                    '320': 18,
                    '321': 35,
                    '322': 47,
                    '323': 100,
                    '324': 101,
                    '325': 115,
                    '326': 109,
                    '327': 111,
                    '328': 115,
                    '329': 46,
                    '330': 114,
                    '331': 101,
                    '332': 97,
                    '333': 99,
                    '334': 116,
                    '335': 105,
                    '336': 111,
                    '337': 110,
                    '338': 115,
                    '339': 46,
                    '340': 118,
                    '341': 49,
                    '342': 46,
                    '343': 77,
                    '344': 115,
                    '345': 103,
                    '346': 65,
                    '347': 100,
                    '348': 100,
                    '349': 82,
                    '350': 101,
                    '351': 97,
                    '352': 99,
                    '353': 116,
                    '354': 105,
                    '355': 111,
                    '356': 110,
                    '357': 18,
                    '358': 38,
                    '359': 47,
                    '360': 100,
                    '361': 101,
                    '362': 115,
                    '363': 109,
                    '364': 111,
                    '365': 115,
                    '366': 46,
                    '367': 114,
                    '368': 101,
                    '369': 97,
                    '370': 99,
                    '371': 116,
                    '372': 105,
                    '373': 111,
                    '374': 110,
                    '375': 115,
                    '376': 46,
                    '377': 118,
                    '378': 49,
                    '379': 46,
                    '380': 77,
                    '381': 115,
                    '382': 103,
                    '383': 82,
                    '384': 101,
                    '385': 109,
                    '386': 111,
                    '387': 118,
                    '388': 101,
                    '389': 82,
                    '390': 101,
                    '391': 97,
                    '392': 99,
                    '393': 116,
                    '394': 105,
                    '395': 111,
                    '396': 110,
                    '397': 18,
                    '398': 36,
                    '399': 47,
                    '400': 99,
                    '401': 111,
                    '402': 115,
                    '403': 109,
                    '404': 119,
                    '405': 97,
                    '406': 115,
                    '407': 109,
                    '408': 46,
                    '409': 119,
                    '410': 97,
                    '411': 115,
                    '412': 109,
                    '413': 46,
                    '414': 118,
                    '415': 49,
                    '416': 46,
                    '417': 77,
                    '418': 115,
                    '419': 103,
                    '420': 69,
                    '421': 120,
                    '422': 101,
                    '423': 99,
                    '424': 117,
                    '425': 116,
                    '426': 101,
                    '427': 67,
                    '428': 111,
                    '429': 110,
                    '430': 116,
                    '431': 114,
                    '432': 97,
                    '433': 99,
                    '434': 116,
                    '435': 18,
                    '436': 34,
                    '437': 47,
                    '438': 100,
                    '439': 101,
                    '440': 115,
                    '441': 109,
                    '442': 111,
                    '443': 115,
                    '444': 46,
                    '445': 114,
                    '446': 101,
                    '447': 112,
                    '448': 111,
                    '449': 114,
                    '450': 116,
                    '451': 115,
                    '452': 46,
                    '453': 118,
                    '454': 49,
                    '455': 46,
                    '456': 77,
                    '457': 115,
                    '458': 103,
                    '459': 67,
                    '460': 114,
                    '461': 101,
                    '462': 97,
                    '463': 116,
                    '464': 101,
                    '465': 82,
                    '466': 101,
                    '467': 112,
                    '468': 111,
                    '469': 114,
                    '470': 116,
                  },
                },
              },
            },
            {
              typeUrl: '/cosmos.authz.v1beta1.MsgGrant',
              value: {
                granter: 'desmos1f5067xm2f65vjalkm55nn5v0s40nyh43lemwwp',
                grantee: 'desmos1g594acavk4mf77v36pvdux8ex7kg427y03mn2c',
                grant: {
                  authorization: {
                    typeUrl: '/desmos.subspaces.v3.authz.GenericSubspaceAuthorization',
                    value: {
                      '0': 10,
                      '1': 1,
                      '2': 5,
                      '3': 18,
                      '4': 34,
                      '5': 47,
                      '6': 100,
                      '7': 101,
                      '8': 115,
                      '9': 109,
                      '10': 111,
                      '11': 115,
                      '12': 46,
                      '13': 114,
                      '14': 101,
                      '15': 112,
                      '16': 111,
                      '17': 114,
                      '18': 116,
                      '19': 115,
                      '20': 46,
                      '21': 118,
                      '22': 49,
                      '23': 46,
                      '24': 77,
                      '25': 115,
                      '26': 103,
                      '27': 67,
                      '28': 114,
                      '29': 101,
                      '30': 97,
                      '31': 116,
                      '32': 101,
                      '33': 82,
                      '34': 101,
                      '35': 112,
                      '36': 111,
                      '37': 114,
                      '38': 116,
                    },
                  },
                  expiration: {
                    seconds: { low: 1995419266, high: 0, unsigned: false },
                    nanos: 73000000,
                  },
                },
              },
            },
          ],
          accountAddressOrWallet: 'desmos1f5067xm2f65vjalkm55nn5v0s40nyh43lemwwp',
        }}
      />

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
      <Stack.Screen name={ROUTES.SELECT_TWEET} component={SelectTweet} />

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

      <Stack.Screen name={ROUTES.PROFILE_CONNECTIONS} component={ProfileConnections} />
      <Stack.Screen name={ROUTES.PROFILE_OPERATIONS} component={ProfileOperations} />

      {/* <Stack.Screen */}
      {/*  name={ROUTES.PROFILE_FOLLOWING_AND_FOLLOWERS} */}
      {/*  component={FollowingAndFollowers} */}
      {/*  options={{ */}
      {/*    gestureResponseDistance, */}
      {/*    cardStyle: styles.followingAndFollowers, */}
      {/*  }} */}
      {/* /> */}

      {/* <Stack.Screen name={ROUTES.PROFILE_NFTS} component={ProfileNfts} /> */}

      {/* --------------------- */}
      {/* --- BOTTOM MODALS --- */}
      {/* --------------------- */}

      <Stack.Group
        screenOptions={{
          cardStyle: {
            backgroundColor: 'transparent',
          },
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
          ...NativeTransition,
        }}>
        <Stack.Screen name={ROUTES.CONFIRM_MODAL} component={ConfirmModal} />
        <Stack.Screen name={ROUTES.TEXTONLY_MODAL} component={TextOnlyModal} />
        <Stack.Screen name={ROUTES.POST_INTERACTION} component={PostInteractionTabs} />
        <Stack.Screen name={ROUTES.CONVERTIBLE_POINTS_MODAL} component={ConvertiblePointsModal} />
        <Stack.Screen name={ROUTES.MANAGE_CONNECTIONS_MODAL} component={ManageConnectionsModal} />
        <Stack.Screen name={ROUTES.CONSENT_AGREEMENT} component={ConsentAgreement} />
        <Stack.Screen name={ROUTES.POST_SEND_TIPS} component={SendTips} />
        <Stack.Screen name={ROUTES.IMPACT_POINTS_MODAL} component={ImpactPointsModal} />
        <Stack.Screen name={ROUTES.POST_REPORT} component={ReportPost} />
        <Stack.Screen name={ROUTES.AUTHORIZATION_MODAL} component={AuthorizationModal} />
        <Stack.Screen
          name={ROUTES.UPLOAD_PROFILE_PICTURES_MODALS}
          component={UploadProfilePicturesModal}
        />
        <Stack.Screen
          name={ROUTES.BACKUP_PHRASE_BOTTOM_MODAL}
          component={BackupPhraseBottomModal}
        />
      </Stack.Group>

      {/* ---------------------- */}
      {/* --- INVITE SCREENS --- */}
      {/* ---------------------- */}

      <Stack.Screen name={ROUTES.MANAGE_INVITES} component={ManageInvites} />

      {/* ------------------------------ */}
      {/* TODO: Categorize these screens */}
      {/* ------------------------------ */}

      {/* <Stack.Screen name={ROUTES.GRANTS} component={Grants} /> */}
      {/* <Stack.Screen name={ROUTES.GRANTS_DETAILS} component={GrantsDetails} /> */}

      {/* <Stack.Screen name={ROUTES.OPERATIONS} component={Operations} /> */}

      {/* <Stack.Screen name={ROUTES.NFT_DETAILS} component={NftDetails} /> */}
    </Stack.Navigator>
  );
};

export default RootNavigator;
