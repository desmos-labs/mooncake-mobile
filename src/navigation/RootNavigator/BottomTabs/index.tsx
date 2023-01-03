import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  bottomActivitiesIcon,
  bottomCommunitiesIcon,
  bottomHomeIcon,
  bottomProfileIcon,
  middleButtonIcon,
  plusWhiteIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import HomeTabs, {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Activities from 'screens/Activities';
import Communities from 'screens/Communities';
import Profile, {UserProfileParams} from 'screens/Profile';
import useStyles from './useStyles';

export type BottomTabsParamList = {
  [ROUTES.HOME_TABS]: HomeTabsParamList;

  [ROUTES.COMMUNITIES]: undefined;

  [ROUTES.ACTIVITIES]: undefined;

  [ROUTES.CREATE_BUTTON]: undefined;

  [ROUTES.USER_PROFILE]: UserProfileParams;
};

const Tab = createBottomTabNavigator<BottomTabsParamList>();

/**
 * Navigation bottom tabs
 */

// Fake component to have a button inside the navigation barß
const MiddleFakeComponent = () => {
  return null;
};

const getCorrectImage = (routeName: string) => {
  switch (routeName) {
    case ROUTES.HOME_TABS:
      return bottomHomeIcon;
    case ROUTES.USER_PROFILE:
      return bottomProfileIcon;
    case ROUTES.ACTIVITIES:
      return bottomActivitiesIcon;
    case ROUTES.COMMUNITIES:
      return bottomCommunitiesIcon;
  }
};

const BottomTabBar = ({state, navigation}: BottomTabBarProps) => {
  const theme = useTheme();
  const styles = useStyles();
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            // @ts-ignore
            navigation.navigate({name: route.name, merge: true});
          }
        };

        if (route.name === ROUTES.CREATE_BUTTON) {
          return (
            <View key={route.key} style={styles.middleButtonView}>
              <ImageButton
                onPress={() => console.log('test')}
                overlayComponent={
                  <FastImage
                    source={plusWhiteIcon}
                    tintColor={theme.colors.white}
                    style={styles.overlayImage}
                  />
                }
                image={middleButtonIcon}
                style={{height: 36, width: 62, alignSelf: 'center'}}
              />
            </View>
          );
        }

        return (
          <View key={route.key} style={styles.buttonView}>
            <ImageButton
              onPress={onPress}
              tintColor={
                isFocused
                  ? theme.colors.butterOrange01
                  : theme.colors.lightGrey02
              }
              image={getCorrectImage(route.name)}
              style={{height: 32, width: 32, alignSelf: 'center'}}
            />
          </View>
        );
      })}
    </SafeAreaView>
  );
};

const BottomTabsNavigator = () => {
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => <BottomTabBar {...props} />,
    [],
  );

  return (
    <Tab.Navigator
      tabBar={renderTabBar}
      initialRouteName={ROUTES.HOME_TABS}
      screenOptions={{headerShown: false}}>
      <Tab.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
      <Tab.Screen name={ROUTES.COMMUNITIES} component={Communities} />
      <Tab.Screen name={ROUTES.CREATE_BUTTON} component={MiddleFakeComponent} />
      <Tab.Screen name={ROUTES.ACTIVITIES} component={Activities} />
      <Tab.Screen name={ROUTES.USER_PROFILE} component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
