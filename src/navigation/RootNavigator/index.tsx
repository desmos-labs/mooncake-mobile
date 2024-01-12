import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  BottomSheetAndroid,
  ModalPresentationIOS,
} from '@react-navigation/stack/src/TransitionConfigs/TransitionPresets';
import { useLoginFlowState } from '@recoil/login';
import usePosthogIdentification from 'hooks/analytics/usePosthogIdentification';
import useInitNotificationsLogic from 'hooks/notifications/useInitNotifications';
import useInitTourGuidesState from 'hooks/tourguide/useInitTourGuidesState';
import useInitializeAppData from 'hooks/useInitializeAppData';
import BottomTabs, { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import HomeTabs, { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import { Dimensions, Platform } from 'react-native';
import Activities from 'screens/Activities';
import BlockedUsers from 'screens/BlockedUsers';
import CreatePost, { CreatePostParams } from 'screens/CreatePost';
import DevScreen from 'screens/DEV';
import DevComponents from 'screens/DEVComponents';
import FeeGrantWaitingScreen, { FeeGrantWaitingScreenParams } from 'screens/FeeGrantWaitingScreen';
import FollowCreators, { FollowCreatorsParams } from 'screens/FollowCreators';
import ImportAccountPrivateKey from 'screens/ImportAccountPrivateKey';
import Landing from 'screens/Landing';
import BottomSheetScreen, { BottomSheetScreenProps } from 'screens/Modals/BottomSheets';
import ConfirmModal, { ConfirmModalParams } from 'screens/Modals/ConfirmModal';
import LoadingModal, { LoadingModalParams } from 'screens/Modals/LoadingModal';
import ReportPost, { ReportPostParams } from 'screens/Modals/ReportPost';
import SelectImageModal, { SelectImageModalParams } from 'screens/Modals/SelectImageModal';
import TextOnlyModal, { TextOnlyModalParams } from 'screens/Modals/TextOnlyModal';
import Onboarding, { OnboardingParams } from 'screens/Onboarding';
import ChangePassword, { PasswordManipulationParams } from 'screens/PasswordManipulation';
import PostDetails, { PostDetailsParams } from 'screens/PostDetails';
import PostReactions, { PostReactionsParams } from 'screens/PostInteraction/PostReactions';
import Profile, { ProfileParams } from 'screens/Profile';
import ProfileConnections, {
  ProfileConnectionsParams,
  ProfileConnectionsTabParams,
} from 'screens/ProfileConnections';
import ProfileOperations, { ProfileOperationsParams } from 'screens/ProfileOperations';
import ProfilePosts, { PostsTabParams, ProfilePostsTabsParams } from 'screens/ProfilePosts';
import SaveProfile, { SaveProfileParams } from 'screens/SaveProfile';
import ServiceAndPolicy, { ServiceAndPolicyParams } from 'screens/ServiceAndPolicy';
import Settings from 'screens/Settings';
import SettingsEnableBiometrics from 'screens/SettingsEnableBiometrics';
import ShowPrivateKey, { ShowPrivateKeyScreenParams } from 'screens/ShowPrivateKey';
import UnlockWallet, { UnlockWalletParams } from 'screens/UnlockWallet';
import WelcomePage, { WelcomePageParams } from 'screens/WelcomeScreen';
import { LoginFlowStep } from 'types/login';

export type RootNavigatorParamList = {
  // -------------------------------------------------------------------------------------
  // --- DEV SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.DEV_SCREEN]: undefined;
  [ROUTES.DEV_COMPONENTS]: undefined;

  // -------------------------------------------------------------------------------------
  // --- INITIAL SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.LANDING]: undefined;
  [ROUTES.ONBOARDING]: OnboardingParams;
  [ROUTES.FOLLOW_CREATORS]: FollowCreatorsParams;
  [ROUTES.WELCOME]: undefined;
  [ROUTES.SERVICE_AND_POLICY]: ServiceAndPolicyParams;
  [ROUTES.WELCOME_PAGE]: WelcomePageParams;
  [ROUTES.FEE_GRANT_WAITING_SCREEN]: FeeGrantWaitingScreenParams;

  // -------------------------------------------------------------------------------------
  // --- ACCOUNTS SCREENS
  // -------------------------------------------------------------------------------------

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
  // --- POST SCREENS
  // -------------------------------------------------------------------------------------

  // Post view
  [ROUTES.POST_DETAILS]: PostDetailsParams;

  // Post actions
  [ROUTES.POST_CREATE]: CreatePostParams | undefined;
  [ROUTES.POST_REPORT]: ReportPostParams;

  // Post interactions
  [ROUTES.POST_REACTIONS]: PostReactionsParams;

  // -------------------------------------------------------------------------------------
  // --- SETTINGS SCREENS
  // -------------------------------------------------------------------------------------

  [ROUTES.SETTINGS]: undefined;
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

  // Profile followage
  [ROUTES.PROFILE_CONNECTIONS]: ProfileConnectionsParams;
  [ROUTES.PROFILE_FOLLOWING]: ProfileConnectionsTabParams;
  [ROUTES.PROFILE_FOLLOWERS]: ProfileConnectionsTabParams;

  // Profile past operations
  [ROUTES.PROFILE_OPERATIONS]: ProfileOperationsParams;

  // -------------------------------------------------------------------------------------
  // --- MODALS
  // -------------------------------------------------------------------------------------

  [ROUTES.TEXTONLY_MODAL]: TextOnlyModalParams;
  [ROUTES.CONFIRM_MODAL]: ConfirmModalParams;
  [ROUTES.SELECT_IMAGE_MODAL]: SelectImageModalParams;
  [ROUTES.POST_REACTIONS]: PostReactionsParams;
  [ROUTES.BOTTOM_SHEET]: BottomSheetScreenProps<any>;
  [ROUTES.LOADING_MODAL]: LoadingModalParams;
};

const Stack = createStackNavigator<RootNavigatorParamList>();

// Feel free to put wip screens here
// they will be organized properly once the final design is ready
const RootNavigator = () => {
  const loginFlowState = useLoginFlowState();

  useInitializeAppData();
  usePosthogIdentification();

  // Init notification logic
  useInitNotificationsLogic();

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
      {__DEV__ && <Stack.Screen name={ROUTES.DEV_COMPONENTS} component={DevComponents} />}
      {/* ----------------------- */}
      {/* --- INITIAL SCREENS --- */}
      {/* ----------------------- */}
      <Stack.Screen name={ROUTES.LANDING} component={Landing} />
      <Stack.Screen name={ROUTES.ONBOARDING} component={Onboarding} />
      <Stack.Screen name={ROUTES.FOLLOW_CREATORS} component={FollowCreators} />
      <Stack.Screen name={ROUTES.SERVICE_AND_POLICY} component={ServiceAndPolicy} />
      <Stack.Screen name={ROUTES.WELCOME_PAGE} component={WelcomePage} />
      <Stack.Screen name={ROUTES.FEE_GRANT_WAITING_SCREEN} component={FeeGrantWaitingScreen} />
      {/* ------------------------ */}
      {/* --- ACCOUNTS SCREENS --- */}
      {/* ------------------------ */}
      <Stack.Screen name={ROUTES.IMPORT_ACCOUNT_PRIVATE_KEY} component={ImportAccountPrivateKey} />
      <Stack.Screen name={ROUTES.PASSWORD_MANIPULATION} component={ChangePassword} />
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
        <Stack.Screen name={ROUTES.POST_REACTIONS} component={PostReactions} />
        <Stack.Screen name={ROUTES.POST_REPORT} component={ReportPost} />
        <Stack.Screen name={ROUTES.SELECT_IMAGE_MODAL} component={SelectImageModal} />
        <Stack.Screen name={ROUTES.BOTTOM_SHEET} component={BottomSheetScreen} />
        <Stack.Screen name={ROUTES.LOADING_MODAL} component={LoadingModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default RootNavigator;
