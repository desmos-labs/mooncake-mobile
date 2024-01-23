import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { mooncakeTextAndLogo, settingsButton } from 'assets/images';
import ImageButton from 'components/ImageButton';
import TabHeader from 'components/TabHeader';
import { Image } from 'expo-image';
import useNavigateToSettings from 'hooks/navigation/useNavigateToSettings';
import Routes from 'navigation/routes';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import useStyles from './useStyles';

/**
 * Tab bar that is present inside the home page of the application.
 * @constructor
 */
const HomeTabBar = ({ state, position, navigation }: MaterialTopTabBarProps) => {
  const styles = useStyles();
  const { t } = useTranslation('home');
  const navigateToSettings = useNavigateToSettings();
  // -------------------------------------------------------------------------------------
  // --- Render
  // -------------------------------------------------------------------------------------

  const getTabName = useCallback(
    (routeName: string) => {
      switch (routeName) {
        case Routes.HOME_TAB_DISCOVER:
          return t('discover');
        case Routes.HOME_TAB_FOLLOWING:
          return t('following');
      }
    },
    [t],
  );

  return (
    <Animated.View style={styles.container}>
      <View style={styles.topView}>
        <Image source={mooncakeTextAndLogo} style={styles.mooncakeLogo} />
        <ImageButton image={settingsButton} style={styles.icon} onPress={navigateToSettings} />
      </View>
      <Animated.View style={styles.tabContainer}>
        <TabHeader
          disableButtons={false}
          state={state}
          position={position}
          navigation={navigation}
          getTabName={getTabName}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default HomeTabBar;
