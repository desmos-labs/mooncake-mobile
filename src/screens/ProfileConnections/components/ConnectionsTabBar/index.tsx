import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import TabHeader from 'components/TabHeader';
import Routes from 'navigation/routes';
import React, { useCallback } from 'react';
import Animated from 'react-native-reanimated';
import useStyles from './useStyles';

interface ProfileConnectionsTabBarProps extends MaterialTopTabBarProps {
  followingTabName: string;
  followersTabName: string;
}

const ConnectionsTabBar = ({
  state,
  position,
  navigation,
  followersTabName,
  followingTabName,
}: ProfileConnectionsTabBarProps) => {
  const styles = useStyles();
  // -------------------------------------------------------------------------------------
  // --- Render
  // -------------------------------------------------------------------------------------

  const getTabName = useCallback(
    (routeName: string) => {
      switch (routeName) {
        case Routes.PROFILE_FOLLOWERS:
          return followersTabName;
        case Routes.PROFILE_FOLLOWING:
          return followingTabName;
      }
    },
    [followersTabName, followingTabName],
  );

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.tabContainer}>
        <TabHeader
          disableButtons={false}
          state={state}
          position={position}
          navigation={navigation}
          getTabName={getTabName}
          spaceBetween={true}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default ConnectionsTabBar;
