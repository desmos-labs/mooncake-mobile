import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon } from 'assets/images';
import HomeSearchBar from 'components/HomeSearchBar';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from 'native-base';
import Animated, {
  FadeInLeft,
  FadeOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import CommonStyles from 'config/theme/CommonStyles';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const ANIMATION_DURATION = 200;
const SLIDE_ANIMATION_DURATION = 300;
const ICON_OFFSET = 80;

/**
 * Tab bar that is present inside the home page of the application.
 * @constructor
 */
const HomeTabBar = ({ state, position, navigation }: MaterialTopTabBarProps) => {
  const styles = useStyles();
  const { t } = useTranslation('home');
  const theme = useTheme();
  const windowWidth = Dimensions.get('window').width;

  // -------------------------------------------------------------------------------------
  // --- States
  // -------------------------------------------------------------------------------------

  const listState = usePostsListState();
  const setListState = useSetPostsListState();

  const [focused, setFocused] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Animated values
  // -------------------------------------------------------------------------------------

  const searchBarWidth = useSharedValue(windowWidth - 64 - 48);
  const xOffset = useSharedValue(0);
  const typeTabOpacity = useSharedValue(1);
  const inviteOpacity = useSharedValue(1);
  const invitePosition = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);
  const cancelPosition = useSharedValue(ICON_OFFSET);

  // -------------------------------------------------------------------------------------
  // --- Animated styles
  // -------------------------------------------------------------------------------------

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
      transform: [{ translateX: xOffset.value }],
    };
  });

  const cancelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cancelOpacity.value,
      transform: [{ translateX: cancelPosition.value }],
    };
  });

  const typeTabAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: typeTabOpacity.value,
    };
  });

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    if (!listState.searchBarFocused) {
      setFocused(false);
      searchBarWidth.value = withTiming(windowWidth - 64 - 48, {
        duration: ANIMATION_DURATION,
      });
      xOffset.value = withTiming(0, { duration: ANIMATION_DURATION });
      typeTabOpacity.value = withTiming(1, {
        duration: ANIMATION_DURATION,
      });
      cancelOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      cancelPosition.value = withTiming(ICON_OFFSET, {
        duration: SLIDE_ANIMATION_DURATION,
      });
      inviteOpacity.value = withDelay(ANIMATION_DURATION, withTiming(1));
      invitePosition.value = withDelay(SLIDE_ANIMATION_DURATION, withTiming(0));
    } else {
      inviteOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      invitePosition.value = withTiming(ICON_OFFSET, {
        duration: SLIDE_ANIMATION_DURATION,
      });
      cancelOpacity.value = withDelay(ANIMATION_DURATION, withTiming(1));
      cancelPosition.value = withDelay(SLIDE_ANIMATION_DURATION, withTiming(0));
    }
  }, [
    cancelOpacity,
    cancelPosition,
    inviteOpacity,
    invitePosition,
    listState.searchBarFocused,
    searchBarWidth,
    typeTabOpacity,
    windowWidth,
    xOffset,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Render
  // -------------------------------------------------------------------------------------

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.animatedView}>
        {!listState.searchBarFocused && (
          <Animated.View
            entering={FadeInLeft.duration(ANIMATION_DURATION + 50)}
            exiting={FadeOutLeft.duration(ANIMATION_DURATION - 50)}
            style={styles.butterFlyImageContainer}>
            <ImageButton
              tintColor={theme.colors.butterOrange01}
              style={styles.butterflyImage}
              image={butterflyLandingIcon}
              onPress={() => setListState({ ...listState, scrollToTop: true })}
            />
          </Animated.View>
        )}
        <Animated.View style={[CommonStyles.position.absolute, animatedStyle]}>
          <HomeSearchBar
            focused={focused}
            searchPlaceHolder={t('search something')}
            handleChange={value => setListState({ ...listState, valueToSearch: value })}
            onFocus={() => {
              searchBarWidth.value = withTiming(windowWidth - 64 - 24, {
                duration: ANIMATION_DURATION,
              });
              xOffset.value = withTiming(-32, { duration: ANIMATION_DURATION });
              typeTabOpacity.value = withTiming(0, {
                duration: ANIMATION_DURATION,
              });
              setFocused(true);
              setListState({ ...listState, searchBarFocused: true });
            }}
          />
        </Animated.View>

        <Animated.View style={[styles.cancelIconContainer, cancelAnimatedStyle]}>
          <TouchableOpacity
            onPress={() => {
              setListState({ ...listState, searchBarFocused: false });
              setFocused(false);
            }}>
            <Typography.Body6>Cancel</Typography.Body6>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <Animated.View style={[styles.tabContainer, typeTabAnimatedStyle]}>
        <PostTypeTab
          disableButtons={typeTabOpacity.value === 0}
          state={state}
          position={position}
          navigation={navigation}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default HomeTabBar;
