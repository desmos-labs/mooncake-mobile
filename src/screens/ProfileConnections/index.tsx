import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import TopBar from 'components/TopBar';
import useFollowersCount from 'hooks/relationships/useFollowersCount';
import useFollowingCount from 'hooks/relationships/useFollowingCount';
import { formatNumShorthand } from 'lib/FormatUtils';
import { useTheme } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionsTabBar from 'screens/ProfileConnections/components/ConnectionsTabBar';
import { DesmosProfile } from 'types/desmos';
import FollowersTab from './components/FollowersTab';
import FollowingTab from './components/FollowingTab';
import useStyles from './useStyles';

// -------------------------------------------------------------------------------------
// --- TAB DATA
// -------------------------------------------------------------------------------------

const Tab = createMaterialTopTabNavigator();
const numOfTabs = 2;

export interface ProfileConnectionsTabParams {
  readonly userAddress: string;
}

// -------------------------------------------------------------------------------------
// --- SCREEN DATA
// -------------------------------------------------------------------------------------

export type ProfileConnectionsParams = {
  readonly profile: DesmosProfile | undefined;
  readonly initialTabRouteName: string;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.PROFILE_CONNECTIONS>;

/**
 * Screen that displays the connections (followers and following) of a given account.
 * @constructor
 */
const ProfileConnections = () => {
  const { t } = useTranslation('relationships');
  const theme = useTheme();
  const styles = useStyles(numOfTabs);

  const route = useRoute<NavProps['route']>();
  const { params } = route;
  const { profile, initialTabRouteName } = params;

  // -------------------------------------------------------------------------------------
  // --- Tab bar labels
  // -------------------------------------------------------------------------------------

  const { count: followingCount, refetch: refreshFollowingCount } = useFollowingCount(
    profile?.address,
  );
  const followingTabName = useMemo(() => {
    return `${formatNumShorthand(followingCount)} ${t('following', {
      ns: 'relationships',
    })}`;
  }, [followingCount, t]);

  const { count: followersCount, refetch: refreshFollowersCount } = useFollowersCount(
    profile?.address,
  );
  const followersTabName = useMemo(() => {
    return `${formatNumShorthand(followersCount)} ${t('followers', {
      ns: 'relationships',
    })}`;
  }, [followersCount, t]);

  const CenterElement = useMemo(() => {
    return <Typography.Semibold14>{profile?.nickname || 'no-nickname'}</Typography.Semibold14>;
  }, [profile?.nickname]);

  const renderTabBar = React.useCallback(
    (props: MaterialTopTabBarProps) => (
      <ConnectionsTabBar
        followersTabName={followersTabName}
        followingTabName={followingTabName}
        {...props}
      />
    ),
    [followersTabName, followingTabName],
  );

  useEffect(() => {
    refreshFollowingCount();
    refreshFollowersCount();
  }, [refreshFollowersCount, refreshFollowingCount]);

  return (
    <DView
      topBar={<TopBar style={styles.topBar} centerElement={CenterElement} />}
      disableHideKeyboardTouchable={true}
      style={styles.container}
      backgroundColor={theme.colors.white}
      scrollable={false}>
      <Tab.Navigator
        initialRouteName={initialTabRouteName}
        screenOptions={{
          swipeEnabled: false,
          lazy: true,
        }}
        tabBar={renderTabBar}
        sceneContainerStyle={styles.tabContainerStyle}>
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWERS}
          component={FollowersTab}
          options={{ tabBarLabel: followersTabName }}
          initialParams={{ userAddress: profile?.address }}
        />
        <Tab.Screen
          name={ROUTES.PROFILE_FOLLOWING}
          component={FollowingTab}
          options={{ tabBarLabel: followingTabName }}
          initialParams={{ userAddress: profile?.address }}
        />
      </Tab.Navigator>
    </DView>
  );
};

export default ProfileConnections;
