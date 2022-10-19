import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ROUTES from 'navigation/routes';
import Home, {HomeParams} from 'screens/Home';
import HomeTabBar from 'navigation/RootNavigator/HomeTabs/components/HomeTabBar';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from 'react-native-paper';
import LoadingOverlay from 'components/LoadingOverlay';
import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import RefreshSession from 'services/axios/requests/RefreshSession';
import {MMKVKEYS, useMMKVStorage} from 'lib/MMKVStorage';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';

export type HomeTabsParamList = {
  [ROUTES.HOME_DISCOVER]: HomeParams;

  [ROUTES.HOME_FOLLOWING]: HomeParams;
};

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>();

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeTabs = () => {
  const theme = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [bearerToken] = useMMKVStorage<string>(MMKVKEYS.REST_AUTH_TOKEN);
  const {replace} = useNavigation<NavProps['navigation']>();

  // Refresh the token if we have one, otherwise have the user relog
  React.useEffect(() => {
    if (bearerToken) {
      RefreshSession();
    } else replace(ROUTES.LOGIN);
  }, []);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => (
      <HomeTabBar {...props} setLoading={setLoading} />
    ),
    [loading],
  );

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: theme.colors.background}}
      edges={['top', 'bottom']}>
      <Tab.Navigator tabBar={renderTabBar}>
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
      <LoadingOverlay isVisible={loading} />
    </SafeAreaView>
  );
};

export default HomeTabs;
