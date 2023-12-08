import notifee from '@notifee/react-native';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  bottomActivitiesIcon,
  bottomHomeIcon,
  bottomProfileIcon,
  middleButtonIcon,
  settingsNavbarIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import HomeTabs, { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { Box, useTheme } from 'native-base';
import { SafeAreaView } from 'react-native-safe-area-context';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import { useAppStateValue, useSetAppStateValue } from '@recoil/appState';
import { useResetCreatePostState } from '@recoil/screens/createPostState';
import { useActiveAccountAddress } from '@recoil/accounts';
import Activities from 'screens/Activities';
import Profile from 'screens/Profile';
import Settings from 'screens/Settings';
import useStyles from './useStyles';

interface Props extends BottomTabBarProps {}

/**
 * Navigation bottom tabs
 */
export type BottomTabsParamList = {
  [ROUTES.HOME_TABS]: HomeTabsParams | undefined;
  [ROUTES.SETTINGS]: undefined;
  /* Disabled as per [DFP-1184](https://forbole.atlassian.net/browse/DFP-1184), may be re-enabled in the future. */
  // [ROUTES.COMMUNITIES]: undefined;
  [ROUTES.ACTIVITIES]: undefined;
  [ROUTES.CREATE_BUTTON]: undefined;
  [ROUTES.PROFILE]: undefined;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

// Fake component to have a button inside the navigation bar
const MiddleFakeComponent = () => {
  return null;
};

/**
 * Returns the correct button image to be used based on the given {@param routeName}.
 */
const getCorrectImage = (routeName: string) => {
  switch (routeName) {
    case ROUTES.HOME_TABS:
      return bottomHomeIcon;
    case ROUTES.PROFILE:
      return bottomProfileIcon;
    case ROUTES.ACTIVITIES:
      return bottomActivitiesIcon;
    case ROUTES.SETTINGS:
      return settingsNavbarIcon;
    /* Disabled as per [DFP-1184](https://forbole.atlassian.net/browse/DFP-1184), may be re-enabled in the future. */
    // case ROUTES.COMMUNITIES:
    //   return bottomCommunitiesIcon;
  }
};

/**
 * Component that represents the bottom tabs of the application.
 * @constructor
 */
const BottomTabBar = (props: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  const { state, navigation } = props;
  const { navigate } = navigation;

  // -------------------------------------------------------------------------------------
  // --- Application state
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const notificationsCount = useAppStateValue('notificationsCount');
  const setNotificationsCount = useSetAppStateValue('notificationsCount');

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const resetCreatePostState = useResetCreatePostState();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressCreatePost = React.useCallback(async () => {
    if (!activeAddress) return;

    // Reset the post creation state to clean any previous post/comment data
    resetCreatePostState();

    // Go to the screen to create a post
    navigate(ROUTES.POST_CREATE);
  }, [activeAddress, navigate, resetCreatePostState]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const OverlayComponent = useMemo(() => {
    if (notificationsCount && notificationsCount > 0) {
      return <PingAnimation size={8} color={theme.colors.butterOrange01} />;
    }
    return undefined; // or alternate "no ping" state
  }, [notificationsCount, theme]);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            if (route.name === ROUTES.ACTIVITIES) {
              await notifee.setBadgeCount(0);
              setNotificationsCount(0);
            }
            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        if (route.name === ROUTES.CREATE_BUTTON) {
          return (
            <View key={route.key} style={styles.middleButtonView}>
              <ImageButton
                onPress={handlePressCreatePost}
                image={middleButtonIcon}
                style={styles.middleButtonImage}
              />
            </View>
          );
        }

        return (
          <View key={route.key} style={styles.buttonView}>
            <ImageButton
              overlayComponent={route.name === ROUTES.ACTIVITIES && OverlayComponent}
              overlayPosition={styles.imageButtonOverlay}
              onPress={onPress}
              tintColor={isFocused ? theme.colors.butterOrange01 : theme.colors.lightGrey02}
              image={getCorrectImage(route.name)}
              style={styles.imageButton}
            />
          </View>
        );
      })}
    </SafeAreaView>
  );
};

/**
 * Navigator that allows to switch between different pages using a bottom tab bar.
 * @constructor
 */
const BottomTabsNavigator = () => {
  const renderTabBar = useCallback((props: BottomTabBarProps) => <BottomTabBar {...props} />, []);

  return (
    <Box flex={1} backgroundColor="white">
      <Tab.Navigator
        tabBar={renderTabBar}
        initialRouteName={ROUTES.HOME_TABS}
        screenOptions={{ headerShown: false }}>
        <Tab.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
        {/* Disabled as per [DFP-1184](https://forbole.atlassian.net/browse/DFP-1184), may be re-enabled in the future. */}
        {/* <Tab.Screen name={ROUTES.COMMUNITIES} component={Communities} /> */}
        <Tab.Screen name={ROUTES.ACTIVITIES} component={Activities} />
        <Tab.Screen name={ROUTES.CREATE_BUTTON} component={MiddleFakeComponent} />
        <Tab.Screen name={ROUTES.SETTINGS} component={Settings} />
        <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
      </Tab.Navigator>
    </Box>
  );
};

export default BottomTabsNavigator;
