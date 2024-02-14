import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute, useRoute, useTheme } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
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
import { DesmosProfile } from 'types/desmos';
import FollowersTab from './components/FollowersTab';
import FollowingTab from './components/FollowingTab';
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
  readonly profile: DesmosProfile | undefined;
  readonly initialTabRouteName: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_CONNECTIONS>;

/**
 * Screen that displays the connections (followers and following) of a given account.
 * @constructor
 */
const ProfileConnections = () => {
  const { t } = useTranslation('relationships');
  const theme = useTheme();
  const styles = useStyles(numOfTabs);

  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const { profile, initialTabRouteName } = params;

  // -------------------------------------------------------------------------------------
  // --- Tab bar labels
  // -------------------------------------------------------------------------------------

  const followingTabName = useMemo(() => {
    return `${formatNumShorthand(profile?.followingCount!)} ${t('following', {
      ns: 'relationships',
    })}`;
  }, [profile?.followingCount, t]);

  const followersTabName = useMemo(() => {
    return `${formatNumShorthand(profile?.followersCount!)} ${t('followers', {
      ns: 'relationships',
    })}`;
  }, [profile?.followersCount, t]);

  const CenterElement = useMemo(() => {
    return <Typography.Semibold16>{profile?.nickname || 'no-nickname'}</Typography.Semibold16>;
  }, [profile?.nickname]);

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
  }, [route, initialTabRouteName]);

  const screenOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: styles.tabBar,
    tabBarContentContainerStyle: styles.tabBarContentContainer,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarInactiveTintColor: theme.colors.neutralVariants['600'],
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled,
    lazy: true,
    tabBarPressColor: 'white',
  };

  return (
    <DView
      topBar={<TopBar style={styles.topBar} centerElement={CenterElement} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      backgroundColor={theme.colors.white}
      scrollable={false}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <Tab.Navigator
        initialRouteName={initialTabRouteName}
        screenOptions={screenOptions}
        sceneContainerStyle={styles.tabContainerStyle}>
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWERS}
          component={FollowersTab}
          options={{ tabBarLabel: followersTabName }}
          initialParams={{ userAddress: profile?.address }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWING}
          component={FollowingTab}
          options={{ tabBarLabel: followingTabName }}
          initialParams={{ userAddress: profile?.address }}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default ProfileConnections;
