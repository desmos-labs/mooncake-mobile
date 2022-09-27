import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import numOfFollowerState from '@recoil/numOfFollowerState';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {formatNumShorthand} from 'lib/FormatUtils';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import FollowingTab from '../Following';
import useStyles from './useStyles';

/**
 * @property {ROUTES.FOLLOWING | ROUTES.FOLLOWERS} initialTabRouteName - The initial tab route name.
 * @property {number} subspaceID - The subspace ID of the user whose following/followers you
 * want to view.
 * @property {string} userAddress - The address of the user whose following/followers you want
 * to see.
 * @property {string} username - The username of the user whose followers/following you want to
 * see.
 */
export type FollowingAndFollowersParams = {
  initialTabRouteName: ROUTES.FOLLOWING | ROUTES.FOLLOWERS;
  subspaceID: number;
  userAddress: string;
  headerTitle: string;
};

/* Creating a new React component that is a tab navigator. */
const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWING_AND_FOLLOWERS
>;

/* A React component for the following and followers screen. */
const FollowingAndFollowers: FC<NavProps> = ({route}) => {
  const {headerTitle, initialTabRouteName, subspaceID, userAddress} =
    route.params;

  const {t} = useTranslation();
  const styles = useStyles(numOfTabs);

  const countOfFollowing = useRecoilValue(
    numOfFollowerState({type: 'following', subspaceID, userAddress}),
  );
  const nameOfFolowing = `${formatNumShorthand(countOfFollowing)} ${t(
    'profile:following',
  )}`;

  const countOfFollowers = useRecoilValue(
    numOfFollowerState({type: 'followers', subspaceID, userAddress}),
  );
  const nameOfFolowers = `${formatNumShorthand(countOfFollowers)} ${t(
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
      _: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => {
      const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
      const focusedRouteName =
        getFocusedRouteNameFromRoute(route) ?? route.params.initialTabRouteName;
      setSwipeEnabled(focusedRouteName !== ROUTES.FOLLOWING || diffX < 0);
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

  const centerElement = (
    <Typography.Subtitle3>{headerTitle}</Typography.Subtitle3>
  );

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
        initialRouteName={initialTabRouteName}
        sceneContainerStyle={styles.tabContainerStyle}>
        <Tab.Screen
          name={ROUTES.FOLLOWING}
          component={FollowingTab}
          options={{tabBarLabel: nameOfFolowing}}
          initialParams={{subspaceID, userAddress, type: 'following'}}
        />
        <Tab.Screen
          name={ROUTES.FOLLOWERS}
          component={FollowingTab}
          options={{tabBarLabel: nameOfFolowers}}
          initialParams={{subspaceID, userAddress, type: 'followers'}}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default FollowingAndFollowers;
