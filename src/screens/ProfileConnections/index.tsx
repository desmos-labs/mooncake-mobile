import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import { getFocusedRouteNameFromRoute, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import { formatNumShorthand } from 'lib/FormatUtils';
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
import { useTheme } from 'native-base';
import useFollowersCount from 'hooks/relationships/useFollowersCount';
import useFollowingCount from 'hooks/relationships/useFollowingCount';
import FollowingTab from './components/FollowingTab';
import FollowersTab from './components/FollowersTab';
import useStyles from './useStyles';

// -------------------------------------------------------------------------------------
// --- TAB DATA
// -------------------------------------------------------------------------------------

const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

export interface ProfileConnectionsTabParams {
  readonly userAddress: string;
}

// -------------------------------------------------------------------------------------
// --- SCREEN DATA
// -------------------------------------------------------------------------------------

export type ProfileConnectionsParams = {
  readonly userAddress: string;
  readonly initialTabRouteName: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_CONNECTIONS>;

/**
 * Screen that displays the connections (followers and following) of a given account.
 * @constructor
 */
const ProfileConnections = () => {
  const { t } = useTranslation('followingAndFollowers');
  const theme = useTheme();
  const styles = useStyles(numOfTabs);

  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const { userAddress, initialTabRouteName } = params;

  // -------------------------------------------------------------------------------------
  // --- Tab bar labels
  // -------------------------------------------------------------------------------------

  const { count: followingCount } = useFollowingCount(userAddress);
  const followingTabName = `${formatNumShorthand(followingCount)} ${t('profile:following')}`;

  const { count: followersCount } = useFollowersCount(userAddress);
  const followersTabName = `${formatNumShorthand(followersCount)} ${t('profile:followers')}`;

  // -------------------------------------------------------------------------------------
  // --- Gestures handlers
  // -------------------------------------------------------------------------------------

  // To allow going back to previous screen via swipe left.
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  // A callback function that is called when the user touches the screen.
  // It enables the swipe handler of tab view, and prevent the swipe event from bubbling to parent.
  const disableParentSwipeLeft = useCallback(() => setSwipeEnabled(true), []);

  // Create a pan responder for the root container.
  const panResponder = useMemo(() => {
    // A callback function that is called when the user start to swipe left.
    // It disables the swipe handler of tab view, and allow the swipe event to bubbling to parent.
    const enableParentSwipeLeft = (
      _gestureResponderEvent: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => {
      const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
      const focusedRouteName = getFocusedRouteNameFromRoute(route) ?? initialTabRouteName;
      setSwipeEnabled(focusedRouteName !== ROUTES.PROFILE_FOLLOWING || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [initialTabRouteName, route]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  const screenOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: styles.tabBar,
    tabBarItemStyle: styles.tabBarItem,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarActiveTintColor: theme.colors.text,
    tabBarInactiveTintColor: theme.colors.grey01,
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled,
  };

  const CenterElement = useMemo(() => {
    return <Typography.Subtitle3>{t('connections')}</Typography.Subtitle3>;
  }, [t]);

  return (
    <DView
      topBar={<TopBar style={styles.topBar} centerElement={CenterElement} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      backgroundColor="transparent"
      scrollable={false}
      onTouchStart={disableParentSwipeLeft}
      {...panResponder.panHandlers}>
      <Tab.Navigator
        initialRouteName={initialTabRouteName}
        screenOptions={screenOptions}
        tabBar={MaterialTopTabBar}
        sceneContainerStyle={styles.tabContainerStyle}>
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWING}
          component={FollowingTab}
          options={{ tabBarLabel: followingTabName }}
          initialParams={{ userAddress }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWERS}
          component={FollowersTab}
          options={{ tabBarLabel: followersTabName }}
          initialParams={{ userAddress }}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default ProfileConnections;
