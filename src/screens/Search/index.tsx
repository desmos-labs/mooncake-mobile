import { usePostsListState, useSetPostsListState } from '@recoil/screens/postsListState';
import DView from 'components/DView';
import HomeSearchBar from 'components/HomeSearchBar';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import SearchViewComponent from 'screens/Search/components/SearchViewComponent';
import useStyles from './useStyles';

const ANIMATION_DURATION = 200;
const SLIDE_ANIMATION_DURATION = 300;
const ICON_OFFSET = 80;

const Search = () => {
  const styles = useStyles();
  const windowWidth = Dimensions.get('window').width;
  const listState = usePostsListState();
  const setListState = useSetPostsListState();
  const { t } = useTranslation('home');
  const searchBarWidth = useSharedValue(windowWidth - 32);
  const xOffset = useSharedValue(0);
  const cancelOpacity = useSharedValue(0);
  const cancelPosition = useSharedValue(ICON_OFFSET);

  const [focused, setFocused] = useState(false);
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

  useEffect(() => {
    if (!listState.searchBarFocused) {
      setFocused(false);
      searchBarWidth.value = withTiming(windowWidth - 32, {
        duration: ANIMATION_DURATION,
      });
      xOffset.value = withTiming(0, { duration: ANIMATION_DURATION });
      cancelOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
      cancelPosition.value = withTiming(ICON_OFFSET, {
        duration: SLIDE_ANIMATION_DURATION,
      });
    } else {
      cancelOpacity.value = withDelay(ANIMATION_DURATION, withTiming(1));
      cancelPosition.value = withDelay(SLIDE_ANIMATION_DURATION, withTiming(0));
    }
  }, [
    cancelOpacity,
    cancelPosition,
    listState.searchBarFocused,
    searchBarWidth,
    windowWidth,
    xOffset,
  ]);

  return (
    <DView>
      <Animated.View style={styles.animatedView}>
        <Animated.View style={[CommonStyles.position.absolute, animatedStyle]}>
          <HomeSearchBar
            focused={focused}
            searchPlaceHolder={t('search user')}
            handleChange={value => setListState({ ...listState, valueToSearch: value })}
            onFocus={() => {
              searchBarWidth.value = withTiming(windowWidth - 72 - 24, {
                duration: ANIMATION_DURATION,
              });
              xOffset.value = withTiming(-32, { duration: ANIMATION_DURATION });
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
      <SearchViewComponent valueToSearch={listState.valueToSearch} />
    </DView>
  );
};

export default Search;
