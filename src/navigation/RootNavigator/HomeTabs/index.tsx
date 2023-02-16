import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import useRefreshSession from 'hooks/useRefreshSession';
import HomeTabBar from 'navigation/RootNavigator/HomeTabs/components/HomeTabBar';
import ROUTES from 'navigation/routes';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Home, { HomeParams } from 'screens/Home';

export type HomeTabsParamList = {
  [ROUTES.HOME_DISCOVER]: HomeParams;
  [ROUTES.HOME_FOLLOWING]: HomeParams;
};

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>();

/**
 * Component that contains all the tabs used inside the home page
 * as part as the bottom tab navigation.
 * @constructor
 */
const HomeTabs = () => {
  const theme = useTheme();
  const { top } = useSafeAreaInsets();

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
        screenOptions={{
          swipeEnabled: false,
        }}>
        <Tab.Screen
          name={ROUTES.HOME_DISCOVER}
          initialParams={{ type: 'discover' }}
          component={Home}
        />

        <Tab.Screen
          name={ROUTES.HOME_FOLLOWING}
          initialParams={{ type: 'following' }}
          component={Home}
        />
      </Tab.Navigator>
    </View>
  );
};

export default HomeTabs;
