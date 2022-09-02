import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {
  StackHeaderProps,
  StackScreenProps,
  Header,
} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo, useState, useCallback, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  View,
} from 'react-native';
import {useRecoilValue} from 'recoil';
import numOfFollowerState from '@recoil/numOfFollowerState';
import {useTheme} from 'react-native-paper';
import {formatNumShorthand} from 'lib/FormatUtils';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import useStyles from './useStyles';
import FollowingTab from '../Following';
import FollowersTab from '../Followers';

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
  username: string;
};

/* Creating a new React component that is a tab navigator. */
const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWING_AND_FOLLOWERS
>;

const HeaderBackImage = () => {
  const styles = useStyles(numOfTabs);
  return <AntDesignIcon name="left" size={20} style={styles.headerBackImage} />;
};

/* A React component that renders the header for the following and followers screen. */
export const FollowingAndFollowersHeader: FC<StackHeaderProps> = ({
  options,
  ...rest
}) => {
  const {username} = rest.route.params as FollowingAndFollowersParams;
  return (
    <Header
      {...rest}
      options={{
        ...options,
        title: username,
        headerShadowVisible: false,
        headerStyle: {borderWidth: 0},
        headerBackImage: HeaderBackImage,
        headerBackTitleVisible: false,
      }}
    />
  );
};

/* A React component for the following and followers screen. */
const FollowingAndFollowers: FC<NavProps> = ({route}) => {
  const {initialTabRouteName, subspaceID, userAddress, username} = route.params;

  const {t} = useTranslation();
  const styles = useStyles(numOfTabs);

  const countOfFollowing = useRecoilValue(
    numOfFollowerState({type: 'following', subspaceID, userAddress}),
  );
  const nameOfFolowing = useMemo(
    () => `${formatNumShorthand(countOfFollowing)} ${t('profile:following')}`,
    [t, countOfFollowing],
  );

  const countOfFollowers = useRecoilValue(
    numOfFollowerState({type: 'followers', subspaceID, userAddress}),
  );
  const nameOfFolowers = useMemo(
    () => `${formatNumShorthand(countOfFollowers)} ${t('profile:followers')}`,
    [t, countOfFollowers],
  );

  /* To allow going back to previous screen via swipe left. */
  const [swipeEnabled, setSwipeEnabled] = useState(true);

  /* A callback function that is called when the user touches the screen.
  It enables the swipe handler of tab view, and prevent the swipe event from bubbling to parent. */
  const disableParentSwipeLeft = useCallback(
    () => setSwipeEnabled(true),
    [setSwipeEnabled],
  );

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

  /* A memoized version of the screen options for the tab navigator. */
  const screenOptions = useMemo<MaterialTopTabNavigationOptions>(
    () => ({
      tabBarStyle: styles.tabBar,
      tabBarItemStyle: styles.tabBarItem,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarActiveTintColor: theme.colors.text,
      tabBarInactiveTintColor: theme.colors.grey01,
      tabBarIndicatorStyle: styles.tabBarIndicator,
      swipeEnabled,
    }),
    [swipeEnabled, styles, theme],
  );

  return (
    <View
      style={styles.container}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={MaterialTopTabBar}
        initialRouteName={initialTabRouteName}>
        <Tab.Screen
          name={ROUTES.FOLLOWING}
          component={FollowingTab}
          options={{tabBarLabel: nameOfFolowing}}
          initialParams={{subspaceID, userAddress, username}}
        />
        <Tab.Screen
          name={ROUTES.FOLLOWERS}
          component={FollowersTab}
          options={{tabBarLabel: nameOfFolowers}}
          initialParams={{subspaceID, userAddress, username}}
        />
      </Tab.Navigator>
    </View>
  );
};

export default FollowingAndFollowers;
