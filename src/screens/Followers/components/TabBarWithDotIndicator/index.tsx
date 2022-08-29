import React, {ComponentProps, FC} from 'react';
import {TabBar} from 'react-native-tab-view';
import useStyles from './useStyles';

/**
 * It's a TabBar component that has a dot indicator instead of a line indicator
 * @returns A TabBar component
 */
const TabBarWithDotIndicator: FC<ComponentProps<typeof TabBar>> = props => {
  const {navigationState} = props;
  const numOfTabs = navigationState.routes.length;
  const styles = useStyles(numOfTabs);
  return (
    <TabBar
      indicatorStyle={styles.tabBarIndicator}
      activeColor={styles.activeColor}
      inactiveColor={styles.inactiveColor}
      style={styles.tabBar}
      tabStyle={styles.tabBarTab}
      labelStyle={styles.tabBarLabel}
      {...props}
    />
  );
};

export default TabBarWithDotIndicator;
