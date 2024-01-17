import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useActiveAccountAddress } from '@recoil/accounts';
import { useAppStateValue, useSetAppStateValue } from '@recoil/appState';
import { useActiveProfile } from '@recoil/profiles';
import { useResetCreatePostState } from '@recoil/screens/createPostState';
import { useSetPostsListState } from '@recoil/screens/postsListState';
import {
  bottomActivitiesFilledIcon,
  bottomActivitiesIcon,
  bottomHomeFilledIcon,
  bottomHomeIcon,
  bottomProfileIcon,
  bottomSearchFilledIcon,
  bottomSearchIcon,
  middleButtonIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import { getProfilePicture } from 'lib/ProfileUtils';
import { Box, useTheme } from 'native-base';
import HomeTabs, { HomeTabsParams } from 'navigation/RootNavigator/HomeTabs';
import SearchTabs, { SearchTabsParams } from 'navigation/RootNavigator/SearchTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Activities from 'screens/Activities';
import Profile from 'screens/Profile';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import useStyles from './useStyles';

interface Props extends BottomTabBarProps {}

/**
 * Navigation bottom tabs
 */
export type BottomTabsParamList = {
  [ROUTES.HOME_TABS]: HomeTabsParams | undefined;
  /* Disabled as per [DFP-1184](https://forbole.atlassian.net/browse/DFP-1184), may be re-enabled in the future. */
  // [ROUTES.COMMUNITIES]: undefined;
  [ROUTES.SEARCH_TABS]: SearchTabsParams | undefined;
  [ROUTES.CREATE_BUTTON]: undefined;
  [ROUTES.ACTIVITIES]: undefined;
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
    case ROUTES.SEARCH_TABS:
      return bottomSearchIcon;
    case ROUTES.PROFILE:
      return bottomProfileIcon;
    case ROUTES.ACTIVITIES:
      return bottomActivitiesIcon;
  }
};

/**
 * Returns the correct button image filled to be used based on the given {@param routeName}.
 */
const getCorrectFilledImage = (routeName: string) => {
  switch (routeName) {
    case ROUTES.HOME_TABS:
      return bottomHomeFilledIcon;
    case ROUTES.SEARCH_TABS:
      return bottomSearchFilledIcon;
    case ROUTES.PROFILE:
      return bottomProfileIcon;
    case ROUTES.ACTIVITIES:
      return bottomActivitiesFilledIcon;
  }
};

const getBottomText = (routeName: string) => {
  switch (routeName) {
    case ROUTES.HOME_TABS:
      return 'Discover';
    case ROUTES.SEARCH_TABS:
      return 'Search';
    case ROUTES.PROFILE:
      return 'You';
    case ROUTES.ACTIVITIES:
      return 'Notifications';
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
  const activeProfile = useActiveProfile();
  const notificationsCount = useAppStateValue('notificationsCount');
  const setNotificationsCount = useSetAppStateValue('notificationsCount');
  const setPostsListState = useSetPostsListState();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const resetCreatePostState = useResetCreatePostState();

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handlePressCreatePost = React.useCallback(async () => {
    if (!activeAddress) {
      return;
    }

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
              setNotificationsCount(0);
            }

            // @ts-ignore
            navigation.navigate({ name: route.name, merge: true });
          } else {
            if (route.name === ROUTES.HOME_TABS) {
              setPostsListState(value => {
                return {
                  ...value,
                  scrollToTop: true,
                };
              });
            }
          }
        };

        if (activeProfile?.profilePicture !== undefined && route.name === ROUTES.PROFILE) {
          return (
            <View key={route.key} style={styles.buttonView}>
              <ImageButton
                onPress={onPress}
                image={getProfilePicture(activeProfile)}
                // @ts-ignore
                style={[styles.profile, isFocused ? styles.profileFocused : undefined]}
              />
              {isFocused ? (
                <Typography.Semibold10
                  style={[styles.text, isFocused ? styles.textFocused : undefined]}
                  numberOfLines={1}
                  ellipsizeMode="middle">
                  {getBottomText(route.name)}
                </Typography.Semibold10>
              ) : (
                <Typography.Regular10
                  style={[styles.text, isFocused ? styles.textFocused : undefined]}
                  numberOfLines={1}
                  ellipsizeMode="middle">
                  {getBottomText(route.name)}
                </Typography.Regular10>
              )}
            </View>
          );
        }

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
              onPress={onPress}
              tintColor={isFocused ? theme.colors.butterOrange01 : theme.colors.lightGrey02}
              image={isFocused ? getCorrectFilledImage(route.name) : getCorrectImage(route.name)}
              style={styles.imageButton}
            />
            {isFocused ? (
              <Typography.Semibold10
                style={[styles.text, isFocused ? styles.textFocused : undefined]}
                numberOfLines={1}
                ellipsizeMode="middle">
                {getBottomText(route.name)}
              </Typography.Semibold10>
            ) : (
              <Typography.Regular10
                style={[styles.text, isFocused ? styles.textFocused : undefined]}
                numberOfLines={1}
                ellipsizeMode="middle">
                {getBottomText(route.name)}
              </Typography.Regular10>
            )}
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
        <Tab.Screen name={ROUTES.SEARCH_TABS} component={SearchTabs} />
        <Tab.Screen name={ROUTES.CREATE_BUTTON} component={MiddleFakeComponent} />
        <Tab.Screen name={ROUTES.ACTIVITIES} component={Activities} />
        <Tab.Screen name={ROUTES.PROFILE} component={Profile} />
      </Tab.Navigator>
    </Box>
  );
};

export default BottomTabsNavigator;
