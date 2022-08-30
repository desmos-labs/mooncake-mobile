import {
  ParamListBase,
  TabNavigationState,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo, useState, useCallback, useRef} from 'react';
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
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from '@react-navigation/material-top-tabs';
import MaterialTopTabBar from '@react-navigation/material-top-tabs/src/views/MaterialTopTabBar';
import useStyles from './useStyles';
import FollowingTab from '../Following/components/TabView';
import FollowersTab from './components/TabView';

/**
 * @property {number} initSubspaceID - The subspace ID of the app.
 * @property {string} initUserAddress - The address of the user we want to display.
 * @property {string} username - The username of the user whose followers you want to see.
 */
export type FollowersParams = {
  initSubspaceID: number;
  initUserAddress: string;
  username: string;
};

/* Creating a new React component that is a tab navigator. */
const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.FOLLOWERS>;

/* A React component that renders the left arrow icon for the go back button. */
const Icon = () => <AntDesignIcon name="left" size={20} />;

/* A React component for the following and followers screen. */
const Followers = () => {
  const {name, params} = useRoute<NavProps['route']>();
  const {initSubspaceID, initUserAddress, username} = params;

  /* Invalid the cache data when the subspaceId or initUserAddress changed. */
  const setParamTab = useSetRecoilState(routeState);
  useEffect(
    () =>
      setParamTab({
        subspaceID: initSubspaceID,
        userAddress: initUserAddress,
        cacheKey: new Date().getTime().toString(),
      }),
    [initSubspaceID, initUserAddress],
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
  const tabNavigation = useRef<TabNavigationState<ParamListBase>>();

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
      setSwipeEnabled((tabNavigation.current?.index ?? 0) > 0 || diffX < 0);
      return false;
    };
    return PanResponder.create({
      onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
      onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
    });
  }, [setSwipeEnabled]);

  /* A custom tab bar that stores the tab navigation state in a ref. */
  const TabBar = useCallback(
    (props: MaterialTopTabBarProps) => {
      tabNavigation.current = props.state;
      return <MaterialTopTabBar {...props} />;
    },
    [tabNavigation],
  );

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
        <Text style={styles.header}>{username}</Text>
      </View>
      <Tab.Navigator
        screenOptions={screenOptions}
        tabBar={TabBar}
        initialRouteName={name}>
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

export default Followers;
