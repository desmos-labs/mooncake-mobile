import notifee from '@notifee/react-native';
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
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import LoadingOverlay from 'components/LoadingOverlay';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import HomeTabs, {HomeTabsParamList} from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useToast} from 'react-native-toast-notifications';
import Activities from 'screens/Activities';
import Communities from 'screens/Communities';
import Profile from 'screens/Profile';
import PingAnimation from 'screens/Profile/components/PingAnimation';
import {useAppStateValue, useSetAppStateValue} from '@recoil/appState';
import {useResetCreatePostState} from '@recoil/screens/createPostState';
import {useActiveAccountAddress} from '@recoil/wallets';
import useStyles from './useStyles';

export interface Props extends BottomTabBarProps {
  setLoading: (_value: boolean) => void;
}

export type BottomTabsParamList = {
  [ROUTES.HOME_TABS]: HomeTabsParamList;
  [ROUTES.COMMUNITIES]: undefined;
  [ROUTES.ACTIVITIES]: undefined;
  [ROUTES.CREATE_BUTTON]: undefined;
  [ROUTES.USER_PROFILE]: undefined;
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

const BottomTabBar = ({state, navigation, setLoading}: Props) => {
  const styles = useStyles();
  const {navigate} = navigation;
  const theme = useTheme();
  const toast = useToast();

  // Useful application state values
  const activeAddress = useActiveAccountAddress();
  const notificationsCount = useAppStateValue('notificationsCount');
  const setNotificationsCount = useSetAppStateValue('notificationsCount');
  const appActiveState = useAppStateValue('appActiveState');

  // Allows to reset the post creation state to delete any draft when needed
  const resetCreatePostState = useResetCreatePostState();

  // Allows to check and update the grants if necessary
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();

  const handlePressCreatePost = React.useCallback(async () => {
    if (!activeAddress) return;

    resetCreatePostState();
    setLoading(true);

    try {
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgCreatePost];

      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
      });

      if (success) {
        navigate(ROUTES.CREATE_TEXT_POST);
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    } catch (err) {
      toast.show(String(err), {type: ToastConfig.ERROR_NO_RETRY});
    } finally {
      setLoading(false);
    }
  }, [activeAddress, checkAndUpdateGrants]);

  const overlayComponent = useMemo(() => {
    if (notificationsCount && notificationsCount > 0) {
      return <PingAnimation size={8} color={theme.colors.butterOrange01} />;
    }
    return undefined; // or alternate "no ping" state
  }, [notificationsCount, appActiveState]);

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = async () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            if (route.name === ROUTES.ACTIVITIES) {
              await notifee.setBadgeCount(0);
              setNotificationsCount(0);
            }
            // @ts-ignore
            navigation.navigate({name: route.name, merge: true});
          }
        };

        if (route.name === ROUTES.CREATE_BUTTON) {
          return (
            <View key={route.key} style={styles.middleButtonView}>
              <ImageButton
                onPress={handlePressCreatePost}
                image={middleButtonIcon}
                style={{height: 41, width: 41, alignSelf: 'center'}}
              />
            </View>
          );
        }

        return (
          <View key={route.key} style={styles.buttonView}>
            <ImageButton
              overlayComponent={
                route.name === ROUTES.ACTIVITIES && overlayComponent
              }
              overlayPosition={{left: 18, top: 2}}
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

/**
 * Navigator that allows to switch between different pages using a bottom tab bar.
 * @constructor
 */
const BottomTabsNavigator = () => {
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => (
      <BottomTabBar {...props} setLoading={setLoading} />
    ),
    [setLoading],
  );

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.white}}>
      <Tab.Navigator
        tabBar={renderTabBar}
        initialRouteName={ROUTES.HOME_TABS}
        screenOptions={{headerShown: false}}>
        <Tab.Screen name={ROUTES.HOME_TABS} component={HomeTabs} />
        <Tab.Screen name={ROUTES.COMMUNITIES} component={Communities} />
        <Tab.Screen
          name={ROUTES.CREATE_BUTTON}
          component={MiddleFakeComponent}
        />
        <Tab.Screen name={ROUTES.ACTIVITIES} component={Activities} />
        <Tab.Screen name={ROUTES.USER_PROFILE} component={Profile} />
      </Tab.Navigator>
      <LoadingOverlay isVisible={loading} />
    </View>
  );
};

export default BottomTabsNavigator;
