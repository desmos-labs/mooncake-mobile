import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { broadcastAnim } from 'assets/animations';
import ThemedLottieView from 'components/ThemedLottieView';
import useRefreshSession from 'hooks/useRefreshSession';
import HomeTabBar from 'navigation/RootNavigator/HomeTabs/components/HomeTabBar';
import ROUTES from 'navigation/routes';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Home, { HomeParams } from 'screens/Home';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';

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
  const { refreshSession } = useRefreshSession();
  const { profile, refetch: fetchProfileData } = useProfileGivenAddress();

  const [screenReady, setScreenReady] = React.useState(false);

  React.useEffect(() => {
    if (profile) setScreenReady(true);
  }, [profile]);

  // Refresh the token if we have one, otherwise perform the login again
  React.useEffect(() => {
    fetchProfileData();
    refreshSession();
  }, []);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => <HomeTabBar {...props} />,
    [],
  );

  if (!screenReady) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedLottieView autoSize autoPlay loop source={broadcastAnim} />
      </SafeAreaView>
    );
  }

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
