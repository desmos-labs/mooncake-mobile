import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import useRefreshSession from 'hooks/apis/useRefreshSession';
import HomeTabBar from 'navigation/RootNavigator/HomeTabs/components/HomeTabBar';
import ROUTES from 'navigation/routes';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home from 'screens/Home';
import { CompositeScreenProps, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';

// -------------------------------------------------------------------------------------
// --- TAB DATA
// -------------------------------------------------------------------------------------

const Tab = createMaterialTopTabNavigator();

// -------------------------------------------------------------------------------------
// --- SCREEN DATA
// -------------------------------------------------------------------------------------

export interface HomeTabsParams {
  /**
   * The initial route name to be used when the user opens the home page.
   */
  readonly initialRouteName?: ROUTES.HOME_TAB_DISCOVER | ROUTES.HOME_TAB_FOLLOWING;
}

type NavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabsParamList, ROUTES.HOME_TABS>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * Component that contains all the tabs used inside the home page
 * as part as the bottom tab navigation.
 * @constructor
 */
const HomeTabs = () => {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const initialRouteName = params?.initialRouteName ?? ROUTES.HOME_TAB_FOLLOWING;

  // Refresh the token if we have one, otherwise perform the login again
  const refreshSession = useRefreshSession();
  React.useEffect(() => {
    // TODO: This should be moved inside the RootNavigator
    refreshSession();

    // Disable the inspection on the next line as we want to run this every
    // time the user opens the Home page anyway
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => <HomeTabBar {...props} />,
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.white,
        paddingTop: Math.max(24, top),
      }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{ swipeEnabled: false }}
        initialRouteName={initialRouteName}>
        <Tab.Screen name={ROUTES.HOME_TAB_DISCOVER} component={Home} />
        <Tab.Screen name={ROUTES.HOME_TAB_FOLLOWING} component={Home} />
      </Tab.Navigator>
    </View>
  );
};

export default HomeTabs;
