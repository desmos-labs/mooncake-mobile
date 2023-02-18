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
import { useTheme } from 'react-native-paper';
import useNumRelationships from '@recoil/numRelationshipState';
import _ from 'lodash';
import FollowingTab, { FollowingParams } from '../Following';
import useStyles from './useStyles';

export type FollowingAndFollowersParams = {
  [ROUTES.PROFILE_FOLLOWING]: FollowingParams;
  [ROUTES.PROFILE_FOLLOWERS]: FollowingParams;
};

/* Creating a new React component that is a tab navigator. */
const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWING_AND_FOLLOWERS>;

/* A React component for the following and followers screen. */
const FollowingAndFollowers = () => {
  const route = useRoute<NavProps['route']>();

  const {
    params: { params },
  } = route;

  const userAddress = _.get(params, 'userAddress', '');
  const headerTitle = _.get(params, 'headerTitle', '');

  const { t } = useTranslation();
  const styles = useStyles(numOfTabs);

  const { numRelationships } = useNumRelationships(userAddress);

  const followingTabName = `${formatNumShorthand(numRelationships?.numFollowing || 0)} ${t(
    'profile:following',
  )}`;

  const followersTabName = `${formatNumShorthand(numRelationships?.numFollowers || 0)} ${t(
    'profile:followers',
  )}`;

  /* To allow going back to previous screen via swipe left. */
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  /* A callback function that is called when the user touches the screen.
  It enables the swipe handler of tab view, and prevent the swipe event from bubbling to parent. */
  const disableParentSwipeLeft = useCallback(() => setSwipeEnabled(true), []);

  /* create a pan responder for the root container. */
  const panResponder = useMemo(() => {
    /* A callback function that is called when the user start to swipe left.
      It disables the swipe handler of tab view, and allow the swipe event to bubbling to parent. */
    const enableParentSwipeLeft = (
      _gestureResponderEvent: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => {
      const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
      const focusedRouteName = getFocusedRouteNameFromRoute(route);
      setSwipeEnabled(focusedRouteName !== ROUTES.PROFILE_FOLLOWING || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [route]);

  const theme = useTheme();

  const screenOptions: MaterialTopTabNavigationOptions = {
    tabBarStyle: styles.tabBar,
    tabBarItemStyle: styles.tabBarItem,
    tabBarLabelStyle: styles.tabBarLabel,
    tabBarActiveTintColor: theme.colors.text,
    tabBarInactiveTintColor: theme.colors.grey01,
    tabBarIndicatorStyle: styles.tabBarIndicator,
    swipeEnabled,
  };

  const centerElement = <Typography.Subtitle3>{headerTitle}</Typography.Subtitle3>;

  return (
    <DView
      topBar={<TopBar style={styles.topBar} centerElement={centerElement} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      backgroundColor="transparent"
      scrollable={false}
      onTouchStart={disableParentSwipeLeft}
      {...panResponder.panHandlers}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={MaterialTopTabBar}
        sceneContainerStyle={styles.tabContainerStyle}>
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWING}
          component={FollowingTab}
          options={{ tabBarLabel: followingTabName }}
          initialParams={params}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWERS}
          component={FollowingTab}
          options={{ tabBarLabel: followersTabName }}
          initialParams={params}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default FollowingAndFollowers;
