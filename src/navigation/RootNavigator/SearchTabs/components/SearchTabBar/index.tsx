import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import TabHeader from 'components/TabHeader';
import Routes from 'navigation/routes';
import React, { useCallback } from 'react';
import Animated from 'react-native-reanimated';
import useStyles from './useStyles';

/**
 * Tab bar that is present inside the search page of the application.
 * @constructor
 */
const SearchTabBar = ({ state, position, navigation }: MaterialTopTabBarProps) => {
  const styles = useStyles();
  // -------------------------------------------------------------------------------------
  // --- Render
  // -------------------------------------------------------------------------------------

  const getTabName = useCallback((routeName: string) => {
    switch (routeName) {
      case Routes.SEARCH_TAB_USERS:
        return 'People';
      case Routes.SEARCH_TAB_POSTS:
        return 'Posts';
    }
  }, []);

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

export default SearchTabBar;
