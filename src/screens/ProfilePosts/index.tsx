import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import UserPostsTab from 'screens/ProfilePosts/UserCreatedPostsTab';
import UserLikedPostsTab from 'screens/ProfilePosts/UserLikedPostsTab';
import useStyles from './useStyles';

// -------------------------------------------------------------------------------------
// --- TAB DATA
// -------------------------------------------------------------------------------------

const numOfTabs = 3;
const Tab = createMaterialTopTabNavigator();

export type PostsTabParams = {
  userAddress: string;
};

// -------------------------------------------------------------------------------------
// --- SCREEN DATA
// -------------------------------------------------------------------------------------

export interface ProfilePostsTabsParams {
  readonly userAddress: string;
  readonly initialTabRouteName: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS>;

/**
 * Screen that allows the user to view all the posts related to a given user.
 * The posts that are shown here will be divided into tabs: all posts, liked posts, and tipped posts.
 * @constructor
 */
const ProfilePosts = () => {
  const { t } = useTranslation('profile');
  const theme = useTheme();
  const styles = useStyles(numOfTabs);

  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const { userAddress, initialTabRouteName } = params;

  // -------------------------------------------------------------------------------------
  // --- Gestures handlers
  // -------------------------------------------------------------------------------------

  const [swipeEnabled, setSwipeEnabled] = useState(true);

  // A callback function that is called when the user touches the screen.
  // It enables the swipe handler of tab view, and prevent the swipe event from bubbling to parent.
  const disableParentSwipeLeft = useCallback(() => setSwipeEnabled(true), []);

  // Create a pan responder for the root container.
  const panResponder = useMemo(() => {
    // A callback function that is called when the user start to swipe left.
    // It disables the swipe handler of tab view, and allow the swipe event to bubbling to parent
    const enableParentSwipeLeft = (
      _: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => {
      const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
      const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? initialTabRouteName;
      setSwipeEnabled(focusedRouteName !== ROUTES.PROFILE_POSTS_POSTS || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [route]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  const screenOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: styles.tabBar,
    tabBarItemStyle: styles.tabBarItem,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarInactiveTintColor: theme.colors.grey01,
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled,
  };

  return (
    <DView
      backgroundColor={theme.colors.white}
      topBar={<TopBar style={{ backgroundColor: theme.colors.white }} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <Typography.H3>{t('posts')}</Typography.H3>
      <Tab.Navigator screenOptions={screenOptions} initialRouteName={ROUTES.PROFILE_POSTS_POSTS}>
        <Tab.Screen
          name={ROUTES.PROFILE_POSTS_POSTS}
          component={UserPostsTab}
          options={{ tabBarLabel: t('posts') }}
          initialParams={{ userAddress }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_POSTS_LIKED}
          component={UserLikedPostsTab}
          options={{ tabBarLabel: t('liked') }}
          initialParams={{ userAddress }}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default ProfilePosts;
