import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
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
import { useTheme } from 'react-native-paper';
import UserLikedPostsTab from 'screens/ProfilePosts/UserLikedPostsTab';
import UserPostsTab from 'screens/ProfilePosts/UserCreatedPostsTab';
import UserTippedPostsTab from 'screens/ProfilePosts/UserTippedPostsData';
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
  readonly initialTabsRouteName: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS>;

/**
 * Screen that allows the user to view all the posts related to a given user.
 * The posts that are shown here will be divided into tabs: all posts, liked posts, and tipped posts.
 * @constructor
 */
const ProfilePosts = () => {
  const route = useRoute<NavProps['route']>();
  const styles = useStyles(numOfTabs);
  const theme = useTheme();
  const { t } = useTranslation('profile');
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const screenOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: styles.tabBar,
    tabBarItemStyle: styles.tabBarItem,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarActiveTintColor: theme.colors.text,
    tabBarInactiveTintColor: theme.colors.grey01,
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled,
  };

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
      const focusedRouteName =
        getFocusedRouteNameFromRoute(route) ?? route.params.initialTabsRouteName;
      setSwipeEnabled(focusedRouteName !== ROUTES.PROFILE_POSTS_POSTS || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [route]);

  return (
    <DView
      backgroundColor={theme.colors.white}
      topBar={<TopBar style={{ backgroundColor: theme.colors.white }} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <Spacer paddingVertical={8} />
      <Typography.H3>{t('posts')}</Typography.H3>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={MaterialTopTabBar}
        initialRouteName={ROUTES.PROFILE_POSTS_POSTS}>
        <Tab.Screen
          name={ROUTES.PROFILE_POSTS_POSTS}
          component={UserPostsTab}
          options={{ tabBarLabel: t('posts') }}
          initialParams={{ userAddress: route.params.userAddress, type: 'posts' }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_POSTS_LIKED}
          component={UserLikedPostsTab}
          options={{ tabBarLabel: t('liked') }}
          initialParams={{ userAddress: route.params.userAddress, type: 'liked' }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_POSTS_TIPPED}
          component={UserTippedPostsTab}
          options={{ tabBarLabel: t('tipped') }}
          initialParams={{
            userAddress: route.params.userAddress,
            type: 'tipped',
          }}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default ProfilePosts;
