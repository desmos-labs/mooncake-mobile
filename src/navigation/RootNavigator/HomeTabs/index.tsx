import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ROUTES from 'navigation/routes';
import {StatusBar, View} from 'react-native';
import Home, {HomeParams} from 'screens/Home';
import HomeTabBar from 'navigation/RootNavigator/HomeTabs/components/HomeTabBar';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import useActiveAccount from 'hooks/useActiveAccount';
import ThemedLottieView from 'components/ThemedLottieView';
import {broadcastAnim} from 'assets/animations';
import useRefreshSession from 'hooks/useRefreshSession';

export type HomeTabsParamList = {
  [ROUTES.HOME_DISCOVER]: HomeParams;

  [ROUTES.HOME_FOLLOWING]: HomeParams;
};

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>();

const HomeTabs = () => {
  const theme = useTheme();
  const {top} = useSafeAreaInsets();
  const {refreshSession} = useRefreshSession();

  const {profileData} = useActiveAccount();

  const [screenReady, setScreenReady] = React.useState(false);

  React.useEffect(() => {
    if (profileData) setScreenReady(true);
  }, [profileData]);

  // Refresh the token if we have one, otherwise have the user relog
  React.useEffect(() => {
    refreshSession();
  }, []);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => <HomeTabBar {...props} />,
    [],
  );

  if (!screenReady) {
    return (
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <Tab.Navigator
        tabBar={renderTabBar}
        screenOptions={{
          swipeEnabled: false,
        }}>
        <Tab.Screen
          name={ROUTES.HOME_DISCOVER}
          initialParams={{type: 'discover'}}
          component={Home}
        />

        <Tab.Screen
          name={ROUTES.HOME_FOLLOWING}
          initialParams={{type: 'following'}}
          component={Home}
        />
      </Tab.Navigator>
    </View>
  );
};

export default HomeTabs;
