import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomSheetAndroid,
  ModalPresentationIOS,
} from '@react-navigation/stack/src/TransitionConfigs/TransitionPresets';
import { useLoginFlowState } from '@recoil/login';
import usePosthogIdentification from 'hooks/analytics/usePosthogIdentification';
import useInitTourGuidesState from 'hooks/tourguide/useInitTourGuidesState';
import useInitializeAppData from 'hooks/useInitializeAppData';
import useInitializeNotifications from 'hooks/useInitializeNotifications';
import BottomTabs, { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import HomeTabs, { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
import PostInteractionTabs, {
  PostInteractionTabParams,
  PostInteractionTabsParamList,
} from 'navigation/RootNavigator/PostInteractionTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import Activities from 'screens/Activities';
import BlockedUsers from 'screens/BlockedUsers';
import Community from 'screens/Community';
import CreatePost, { CreatePostParams } from 'screens/CreatePost';
import DevScreen from 'screens/DEV';
import FeeGrantWaitingScreen, { FeeGrantWaitingScreenParams } from 'screens/FeeGrantWaitingScreen';
import ImportAccountPrivateKey from 'screens/ImportAccountPrivateKey';
import ImportAccountSelectProfile, {
  SelectAccountParamList,
} from 'screens/ImportAccountSelectProfile';
import Landing from 'screens/Landing';
import ConfirmModal, { ConfirmModalParams } from 'screens/Modals/ConfirmModal';
import ConvertiblePointsModal from 'screens/Modals/ConvertiblePointsModal';
import ImpactPointsModal from 'screens/Modals/ImpactPointsModal';
import ReportPost, { ReportPostParams } from 'screens/Modals/ReportPost';
import SelectImageModal, { SelectImageModalParams } from 'screens/Modals/SelectImageModal';
import SendTips, { SendTipsParams } from 'screens/Modals/SendTips';
import TextOnlyModal, { TextOnlyModalParams } from 'screens/Modals/TextOnlyModal';
import Onboarding, { OnboardingParams } from 'screens/Onboarding';
import ChangePassword, { PasswordManipulationParams } from 'screens/PasswordManipulation';
import PostDetails, { PostDetailsParams } from 'screens/PostDetails';
import Profile, { ProfileParams } from 'screens/Profile';
import ProfileConnections, {
  ProfileConnectionsParams,
  ProfileConnectionsTabParams,
} from 'screens/ProfileConnections';
import ProfileOperations, { ProfileOperationsParams } from 'screens/ProfileOperations';
import ProfilePosts, { PostsTabParams, ProfilePostsTabsParams } from 'screens/ProfilePosts';
import SaveAccount, { SaveAccountParams } from 'screens/SaveAccount';
import SaveProfile, { SaveProfileParams } from 'screens/SaveProfile';
import ServiceAndPolicy, { ServiceAndPolicyParams } from 'screens/ServiceAndPolicy';
import Settings from 'screens/Settings';
import SettingsEnableBiometrics from 'screens/SettingsEnableBiometrics';
import ShowPrivateKey, { ShowPrivateKeyScreenParams } from 'screens/ShowPrivateKey';
import UnlockWallet, { UnlockWalletParams } from 'screens/UnlockWallet';
import WelcomePage, { WelcomePageParams } from 'screens/WelcomeScreen';
import { LoginFlowStep } from 'types/login';
import TxLoading, { TxLoadingParams } from 'screens/TxLoading';

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
  [ROUTES.WELCOME]: undefined;
  [ROUTES.SERVICE_AND_POLICY]: ServiceAndPolicyParams;
  [ROUTES.WELCOME_PAGE]: WelcomePageParams;
  [ROUTES.FEE_GRANT_WAITING_SCREEN]: FeeGrantWaitingScreenParams;

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.IMPORT_ACCOUNT_SELECT_PROFILE]: SelectAccountParamList;
  [ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT]: SaveAccountParams;
  [ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY]: undefined;

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

  [ROUTES.TX_LOADING]: TxLoadingParams;

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
  [ROUTES.UNLOCK_WALLET]: UnlockWalletParams;
  [ROUTES.BLOCKED_USERS]: undefined;

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

  [ROUTES.IMPACT_POINTS_MODAL]: undefined;

  // -------------------------------------------------------------------------------------
  // --- MODALS
  // -------------------------------------------------------------------------------------

  [ROUTES.CONVERTIBLE_POINTS_MODAL]: undefined;
  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.BACKUP_PHRASE_BOTTOM_MODAL]: undefined;
  [ROUTES.SELECT_IMAGE_MODAL]: SelectImageModalParams;

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
  const loginFlowState = useLoginFlowState();

  useInitializeAppData();
  useInitializeNotifications();
  usePosthogIdentification();
  // Init the tour guides state.
  useInitTourGuidesState();
  //  To allow going back to previous screen via swipe left.
  const { height, width } = Dimensions.get('window');
  const gestureResponseDistance = Math.max(height, width);

  // If active account -> go to Homescreen
  const initialRoute = React.useMemo(() => {
    if (__DEV__) {
      return ROUTES.DEV_SCREEN;
    }

    switch (loginFlowState.step) {
      case LoginFlowStep.Completed:
        return ROUTES.BOTTOM_TABS;
      default:
        // The other cases will be handled in the landing page.
        return ROUTES.LANDING;
    }
  }, [loginFlowState]);

  const NativeTransition = Platform.select({
    ios: ModalPresentationIOS,
    default: BottomSheetAndroid,
  });

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
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
      <Stack.Screen name={ROUTES.SERVICE_AND_POLICY} component={ServiceAndPolicy} />
      <Stack.Screen name={ROUTES.WELCOME_PAGE} component={WelcomePage} />
      <Stack.Screen name={ROUTES.FEE_GRANT_WAITING_SCREEN} component={FeeGrantWaitingScreen} />
      {/* ------------------------ */}
      {/* --- ACCOUNTS SCREENS --- */}
      {/* ------------------------ */}
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY} component={ImportAccountPrivateKey} />
      <Stack.Screen
        name={ROUTES.IMPORT_ACCOUNT_SELECT_PROFILE}
        component={ImportAccountSelectProfile}
      />
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_SAVE_ACCOUNT} component={SaveAccount} />
      <Stack.Screen name={ROUTES.PASSWORD_MANIPULATION} component={ChangePassword} />
      {/* ------------------------------------ */}
      {/* --- BROADCAST TRANSACTION SCREEN --- */}
      {/* ------------------------------------ */}
      <Stack.Screen name={ROUTES.TX_LOADING} component={TxLoading} />
      {/* -------------------- */}
      {/* --- HOME SCREENS --- */}
      {/* -------------------- */}
      <Stack.Screen name={ROUTES.BOTTOM_TABS} component={BottomTabs} />
      <Stack.Screen name={ROUTES.ACTIVITIES} component={Activities} />
      <Stack.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
      {/* -------------------- */}
      {/* --- POST SCREENS --- */}
      {/* -------------------- */}
      <Stack.Screen
        name={ROUTES.POST_CREATE}
        component={CreatePost}
        options={({ route }) => ({
          gestureEnabled: !route?.params?.disableBackSwipe,
        })}
      />
      <Stack.Screen name={ROUTES.POST_DETAILS} component={PostDetails} />
      {/* ------------------------ */}
      {/* --- SETTINGS SCREENS --- */}
      {/* ------------------------ */}
      <Stack.Screen name={ROUTES.SETTINGS} component={Settings} />
      <Stack.Screen name={ROUTES.SETTINGS_COMMUNITY} component={Community} />
      <Stack.Screen name={ROUTES.SETTINGS_SHOW_PRIVATE_KEY} component={ShowPrivateKey} />
      <Stack.Screen name={ROUTES.SETTINGS_ENABLE_BIOMETRICS} component={SettingsEnableBiometrics} />
      <Stack.Screen name={ROUTES.UNLOCK_WALLET} component={UnlockWallet} />
      <Stack.Screen name={ROUTES.BLOCKED_USERS} component={BlockedUsers} />
      {/* ----------------------- */}
      {/* --- PROFILE SCREENS --- */}
      {/* ----------------------- */}
      <Stack.Screen name={ROUTES.SAVE_PROFILE} component={SaveProfile} />
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
        <Stack.Screen name={ROUTES.POST_SEND_TIPS} component={SendTips} />
        <Stack.Screen name={ROUTES.IMPACT_POINTS_MODAL} component={ImpactPointsModal} />
        <Stack.Screen name={ROUTES.POST_REPORT} component={ReportPost} />
        <Stack.Screen name={ROUTES.SELECT_IMAGE_MODAL} component={SelectImageModal} />
      </Stack.Group>
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
