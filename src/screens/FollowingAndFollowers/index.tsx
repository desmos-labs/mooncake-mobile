import {useNavigation, useRoute} from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {StackScreenProps} from '@react-navigation/stack';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  GestureResponderEvent,
  I18nManager,
  PanResponder,
  PanResponderGestureState,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {Route, SceneMap, TabView, TabBar} from 'react-native-tab-view';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import followingAndFollowersState from '@recoil/followingAndFollowers';
import countOfFollowersState from '@recoil/followingAndFollowers/countOfFollowersState';
import countOfFollowingState from '@recoil/followingAndFollowers/countOfFollowingState';
import {IconButton} from 'react-native-paper';
import {formatNumShorthand} from 'lib/FormatUtils';
import useStyles from './useStyles';
import FollowingTab from './components/FollowingTab';
import FollowersTab from './components/FollowersTab';
import TabBarWithDotIndicator from './components/TabBarWithDotIndicator';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWING_AND_FOLLOWERS
>;

const renderScene = SceneMap({
  following: FollowingTab,
  followers: FollowersTab,
});

const renderTabBar: ComponentProps<typeof TabView>['renderTabBar'] = props => {
  return <TabBarWithDotIndicator {...TabBar.defaultProps} {...props} />;
};

const Icon = () => <AntDesignIcon name="left" size={20} />;

const FollowingAndFollowers = () => {
  const {params} = useRoute<NavProps['route']>();
  const {initialTabIndex, initSubspaceID, initUserAddress, username} = params;

  const setParamTab = useSetRecoilState(followingAndFollowersState);
  useEffect(
    () =>
      setParamTab({
        subspaceID: initSubspaceID,
        userAddress: initUserAddress,
        cacheKey: new Date().getTime().toString(),
      }),
    [initSubspaceID, initUserAddress],
  );

  const countOfFollowing = useRecoilValue(countOfFollowingState);
  const countOfFollowers = useRecoilValue(countOfFollowersState);
  const [selectedTabIndex, setSelectedTabIndex] = useState(initialTabIndex);

  const {t} = useTranslation();
  const styles = useStyles();

  const {goBack} = useNavigation<NavProps['navigation']>();

  const routes: Route[] = useMemo(
    () => [
      {
        key: 'following',
        title: `${formatNumShorthand(countOfFollowing)} ${t(
          'profile:following',
        )}`,
      },
      {
        key: 'followers',
        title: `${formatNumShorthand(countOfFollowers)} ${t(
          'profile:followers',
        )}`,
      },
    ],
    [countOfFollowing, countOfFollowers],
  );
  const {width} = Dimensions.get('window');

  const [swipeEnabled, setSwipeEnabled] = useState(true);

  const enableParentSwipeLeft = useCallback(
    (_: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const diffX = I18nManager.isRTL ? -gestureState.dx : gestureState.dx;
      setSwipeEnabled(selectedTabIndex > 0 || diffX < 0);
      return false;
    },
    [selectedTabIndex, setSwipeEnabled],
  );

  const disableParentSwipeLeft = useCallback(
    () => setSwipeEnabled(true),
    [setSwipeEnabled],
  );

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponderCapture: enableParentSwipeLeft,
        onMoveShouldSetPanResponderCapture: enableParentSwipeLeft,
      }),
    [enableParentSwipeLeft],
  );

  return (
    <SafeAreaView
      style={styles.container}
      {...panResponder.panHandlers}
      onTouchStart={disableParentSwipeLeft}>
      <View style={styles.navigationBar}>
        <IconButton icon={Icon} style={styles.backButton} onPress={goBack} />
        <Text style={styles.header}>{username}</Text>
      </View>
      <TabView
        navigationState={{index: selectedTabIndex, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setSelectedTabIndex}
        initialLayout={{width}}
        swipeEnabled={swipeEnabled}
      />
    </SafeAreaView>
  );
};

export default FollowingAndFollowers;
