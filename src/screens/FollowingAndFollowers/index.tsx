import {
  getFocusedRouteNameFromRoute,
  Route,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo, useState, useCallback, FC} from 'react';
import {useTranslation} from 'react-i18next';
import {
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import routeState from '@recoil/followingAndFollowers/routeState';
import countState from '@recoil/followingAndFollowers/countState';
import {IconButton, useTheme} from 'react-native-paper';
import {formatNumShorthand} from 'lib/FormatUtils';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import useStyles from './useStyles';
import FollowingTab from './components/TabViewOfFollowing';
import FollowersTab from './components/TabViewOfFollowers';

/**
 * @property {ROUTES.FOLLOWING | ROUTES.FOLLOWERS} initialTabRouteName - The initial tab route name.
 * @property {number} initialSubspaceID - The subspace ID of the user whose following/followers you
 * want to see.
 * @property {string} initialUserAddress - The address of the user whose following/followers you want
 * to see.
 * @property {string} initialUsername - The username of the user whose followers/following you want to
 * see.
 */
export type FollowingAndFollowersParams = {
  initialTabRouteName: ROUTES.FOLLOWING | ROUTES.FOLLOWERS;
  initialSubspaceID: number;
  initialUserAddress: string;
  initialUsername: string;
};

/* Creating a new React component that is a tab navigator. */
const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.FOLLOWING>;

/* A React component that renders the left arrow icon for the go back button. */
const Icon = () => <AntDesignIcon name="left" size={20} />;

/* A React component for the following and followers screen. */
const Following: FC<{route: Route<string>}> = ({route}) => {
  const {params} = useRoute<NavProps['route']>();
  const {
    initialTabRouteName,
    initialSubspaceID,
    initialUserAddress,
    initialUsername,
  } = params;

  /* Invalid the cache data when the subspaceId or userAddress changed. */
  const setParamTab = useSetRecoilState(routeState);
  useEffect(
    () =>
      setParamTab({
        subspaceID: initialSubspaceID,
        userAddress: initialUserAddress,
        cacheKey: new Date().getTime().toString(),
      }),
    [initialSubspaceID, initialUserAddress],
  );

  const {t} = useTranslation();
  const styles = useStyles(numOfTabs);

  const {goBack} = useNavigation<NavProps['navigation']>();

  const countOfFollowing = useRecoilValue(countState('following'));
  const nameOfFolowing = useMemo(
    () => `${formatNumShorthand(countOfFollowing)} ${t('profile:following')}`,
    [t, countOfFollowing],
  );

  const countOfFollowers = useRecoilValue(countState('followers'));
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
      const focusedRouteName = getFocusedRouteNameFromRoute(route);
      setSwipeEnabled(focusedRouteName !== ROUTES.FOLLOWING || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [route, setSwipeEnabled]);

  const theme = useTheme();

  /* A memoized version of the screen options for the tab navigator. */
  const screenOptions: MaterialTopTabNavigationOptions = useMemo(
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
    <SafeAreaView
      style={styles.container}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <View style={styles.navigationBar}>
        <IconButton icon={Icon} style={styles.backButton} onPress={goBack} />
        <Text style={styles.header}>{initialUsername}</Text>
      </View>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={MaterialTopTabBar}
        initialRouteName={initialTabRouteName}>
        <Tab.Screen
          name={ROUTES.FOLLOWING}
          component={FollowingTab}
          options={{tabBarLabel: nameOfFolowing}}
        />
        <Tab.Screen
          name={ROUTES.FOLLOWERS}
          component={FollowersTab}
          options={{tabBarLabel: nameOfFolowers}}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default Following;
