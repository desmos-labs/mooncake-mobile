import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { butterflyLandingIcon, homeInviteIcon } from 'assets/images';
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
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

/**
 * Tab bar that is present inside the home page of the application.
 * @constructor
 */
const HomeTabBar = ({ state, position, navigation }: MaterialTopTabBarProps) => {
  const styles = useStyles();
  const { t } = useTranslation('home');
  const { navigate } = useNavigation<NavProps['navigation']>();
  const theme = useTheme();

  // List state
  const listState = usePostsListState();
  const setListState = useSetPostsListState();

  // Search bar details
  const searchBarWidth = useSharedValue(Dimensions.get('window').width - 64 - 48);
  const xOffset = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
      transform: [{ translateX: xOffset.value }],
      position: 'absolute',
    };
  });

  useEffect(() => {
    if (!listState.searchBarFocused) {
      setFocused(false);
    }
  }, [listState.searchBarFocused]);

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.animatedView}>
        {!listState.searchBarFocused && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={styles.searchBarLeftElement}>
            <ImageButton
              tintColor={theme.colors.butterOrange01}
              style={styles.butterflyImage}
              image={butterflyLandingIcon}
              onPress={() => setListState(value => ({ ...value, scrollToTop: true }))}
            />
          </Animated.View>
        )}
        <Animated.View style={animatedStyle}>
          <HomeSearchBar
            focused={focused}
            searchPlaceHolder={t('search something')}
            handleChange={() => console.log('test')}
            onFocus={() => {
              searchBarWidth.value = withTiming(Dimensions.get('window').width - 64 - 24);
              xOffset.value = withTiming(-32);
              setFocused(true);
              setListState(value => ({ ...value, searchBarFocused: true }));
            }}
            onBlur={() => {
              searchBarWidth.value = withTiming(Dimensions.get('window').width - 64 - 48);
              xOffset.value = withTiming(0);
              setListState(value => ({ ...value, searchBarFocused: false }));
            }}
          />
        </Animated.View>

        {!listState.searchBarFocused ? (
          <Animated.View exiting={FadeOut.duration(300)} style={styles.searchBarRightElement}>
            <ImageButton
              style={styles.rightButton}
              image={homeInviteIcon}
              onPress={() => navigate(ROUTES.SETTINGS_INVITES)}
            />
          </Animated.View>
        ) : (
          <Animated.View style={styles.searchBarRightElement} exiting={FadeOut.duration(300)}>
            <TouchableOpacity
              onPress={() => {
                setListState(value => ({ ...value, searchBarFocused: false }));
                setFocused(false);
              }}>
              <Typography.Body6>{t('common:cancel')}</Typography.Body6>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
      {!listState.searchBarFocused && (
        <Animated.View style={styles.tabContainer} exiting={FadeOut.duration(300)}>
          <PostTypeTab state={state} position={position} navigation={navigation} />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default HomeTabBar;
