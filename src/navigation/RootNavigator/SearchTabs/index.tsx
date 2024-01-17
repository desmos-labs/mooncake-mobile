import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import HomeSearchBar from 'components/HomeSearchBar';
import CommonStyles from 'config/theme/CommonStyles';
import { EventEmitter } from 'events';
import { Box, useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import SearchTabBar from 'navigation/RootNavigator/SearchTabs/components/SearchTabBar';
import ROUTES from 'navigation/routes';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, StatusBar, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchPostsTab from 'screens/SearchPosts';
import SearchUsersTab from 'screens/SearchUsers';
import useStyles from './useStyles';

const ANIMATION_DURATION = 200;
const SLIDE_ANIMATION_DURATION = 300;
const ICON_OFFSET = 80;

// -------------------------------------------------------------------------------------
// --- TAB DATA
// -------------------------------------------------------------------------------------

const Tab = createMaterialTopTabNavigator();

// -------------------------------------------------------------------------------------
// --- SCREEN DATA
// -------------------------------------------------------------------------------------

export interface SearchTabsParams {
  /**
   * The initial route name to be used when the user opens the home page.
   */
  readonly initialRouteName?: ROUTES.SEARCH_TAB_USERS | ROUTES.SEARCH_TAB_POSTS;
}

export type SearchTabsParamList = {
  [ROUTES.SEARCH_TAB_USERS]: {
    eventEmitter: EventEmitter;
  };
  [ROUTES.SEARCH_TAB_POSTS]: {
    eventEmitter: EventEmitter;
  };
};

type NavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, ROUTES.SEARCH_TABS>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * Component that contains all the tabs used inside the home page
 * as part as the bottom tab navigation.
 * @constructor
 */
const SearchTabs = () => {
  const theme = useTheme();
  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const initialRouteName = params?.initialRouteName;
  const { top } = useSafeAreaInsets();
  const { t } = useTranslation('home');
  const windowWidth = Dimensions.get('window').width;
  const styles = useStyles();
  const setListState = useSetPostsListState();
  const listState = usePostsListState();
  const eventEmitter = useRef(new EventEmitter());

  // Animations
  const searchBarWidth = useSharedValue(windowWidth - 32);
  const xOffset = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);
  const cancelPosition = useSharedValue(ICON_OFFSET);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
      transform: [{ translateX: xOffset.value }],
    };
  });

  const cancelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cancelOpacity.value,
      transform: [{ translateX: cancelPosition.value }],
    };
  });

  useEffect(() => {
    if (!listState.searchBarFocused) {
      setFocused(false);
      searchBarWidth.value = withTiming(windowWidth - 32, {
        duration: ANIMATION_DURATION,
      });
      xOffset.value = withTiming(0, { duration: ANIMATION_DURATION });
      cancelOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      cancelPosition.value = withTiming(ICON_OFFSET, {
        duration: SLIDE_ANIMATION_DURATION,
      });
    } else {
      cancelOpacity.value = withDelay(ANIMATION_DURATION, withTiming(1));
      cancelPosition.value = withDelay(SLIDE_ANIMATION_DURATION, withTiming(0));
    }
  }, [
    cancelOpacity,
    cancelPosition,
    listState.searchBarFocused,
    searchBarWidth,
    windowWidth,
    xOffset,
  ]);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => <SearchTabBar {...props} />,
    [],
  );

  return (
    <Box
      flex={1}
      style={{
        backgroundColor: theme.colors.white,
        paddingTop: Math.max(24, top),
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Animated.View style={styles.animatedView}>
        <Animated.View style={[CommonStyles.position.absolute, animatedStyle]}>
          <HomeSearchBar
            focused={focused}
            searchPlaceHolder={t('search user')}
            handleChange={value => eventEmitter.current.emit('valueChange', value)}
            onFocus={() => {
              searchBarWidth.value = withTiming(windowWidth - 72 - 24, {
                duration: ANIMATION_DURATION,
              });
              xOffset.value = withTiming(-32, { duration: ANIMATION_DURATION });
              setFocused(true);
              setListState({ ...listState, searchBarFocused: true });
            }}
          />
        </Animated.View>
        <Animated.View style={[styles.cancelIconContainer, cancelAnimatedStyle]}>
          <TouchableOpacity
            onPress={() => {
              setListState({ ...listState, searchBarFocused: false });
              setFocused(false);
            }}>
            <Typography.Regular14>Cancel</Typography.Regular14>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{ swipeEnabled: false, lazy: true }}
        initialRouteName={initialRouteName}>
        <Tab.Screen
          name={ROUTES.SEARCH_TAB_USERS}
          component={SearchUsersTab}
          initialParams={{
            eventEmitter: eventEmitter.current,
          }}
        />
        <Tab.Screen
          name={ROUTES.SEARCH_TAB_POSTS}
          component={SearchPostsTab}
          initialParams={{
            eventEmitter: eventEmitter.current,
          }}
        />
      </Tab.Navigator>
    </Box>
  );
};

export default SearchTabs;
