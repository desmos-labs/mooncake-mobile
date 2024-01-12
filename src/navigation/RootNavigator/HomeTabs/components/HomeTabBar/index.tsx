import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import React from 'react';
import Animated from 'react-native-reanimated';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import useStyles from './useStyles';

/**
 * Tab bar that is present inside the home page of the application.
 * @constructor
 */
const HomeTabBar = ({ state, position, navigation }: MaterialTopTabBarProps) => {
  const styles = useStyles();
  // -------------------------------------------------------------------------------------
  // --- Render
  // -------------------------------------------------------------------------------------

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.tabContainer}>
        <PostTypeTab
          disableButtons={false}
          state={state}
          position={position}
          navigation={navigation}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default HomeTabBar;
