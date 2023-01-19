import {MaterialTopTabBarProps} from '@react-navigation/material-top-tabs/lib/typescript/src/types';
import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import postsListOptions from '@recoil/postsListRef';
import {butterflyLandingIcon, homeInviteIcon} from 'assets/images';
import HomeSearchBar from 'components/HomeSearchBar';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useRecoilState} from 'recoil';
import PostTypeTab from 'screens/Home/components/PostTypeTab';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.HOME_TABS>;

const HomeTabBar = ({state, position, navigation}: MaterialTopTabBarProps) => {
  const styles = useStyles();
  const {t} = useTranslation('home');
  const {navigate} = useNavigation<NavProps['navigation']>();
  const theme = useTheme();
  const [listOptions, setListOptions] = useRecoilState(postsListOptions);
  const searchBarWidth = useSharedValue(
    Dimensions.get('window').width - 64 - 48,
  );
  const xOffset = useSharedValue(0);
  const [focused, setFocused] = useState(false);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: searchBarWidth.value,
      transform: [{translateX: xOffset.value}],
    };
  });

  useEffect(() => {
    if (!listOptions.searchBarFocused) {
      setFocused(false);
    }
  }, [listOptions.searchBarFocused]);

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.animatedView}>
        {!listOptions.searchBarFocused && (
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(300)}
            style={{position: 'absolute', left: 0, right: 'auto'}}>
            <ImageButton
              tintColor={theme.colors.butterOrange01}
              style={styles.butterflyImage}
              image={butterflyLandingIcon}
              onPress={() =>
                setListOptions({...listOptions, scrollToTop: true})
              }
            />
          </Animated.View>
        )}
        <Animated.View style={[{position: 'absolute'}, animatedStyle]}>
          <HomeSearchBar
            focused={focused}
            searchPlaceHolder={t('search something')}
            handleChange={() => console.log('test')}
            onFocus={() => {
              searchBarWidth.value = withTiming(
                Dimensions.get('window').width - 64 - 24,
              );
              xOffset.value = withTiming(-32);
              setFocused(true);
              setListOptions({...listOptions, searchBarFocused: true});
            }}
            onBlur={() => {
              searchBarWidth.value = withTiming(
                Dimensions.get('window').width - 64 - 48,
              );
              xOffset.value = withTiming(0);
              setListOptions({...listOptions, searchBarFocused: false});
            }}
          />
        </Animated.View>

        {!listOptions.searchBarFocused ? (
          <Animated.View
            exiting={FadeOut.duration(300)}
            style={{position: 'absolute', left: 'auto', right: 0}}>
            <ImageButton
              style={styles.rightButton}
              image={homeInviteIcon}
              onPress={() => navigate(ROUTES.INVITES)}
            />
          </Animated.View>
        ) : (
          <Animated.View
            style={{
              marginLeft: theme.spacing.m,
              position: 'absolute',
              left: 'auto',
              right: 0,
            }}
            exiting={FadeOut.duration(300)}>
            <TouchableOpacity
              onPress={() => {
                setListOptions({...listOptions, searchBarFocused: false});
                setFocused(false);
              }}>
              <Typography.Body6>Cancel</Typography.Body6>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
      {!listOptions.searchBarFocused && (
        <Animated.View
          style={styles.tabContainer}
          exiting={FadeOut.duration(300)}>
          <PostTypeTab
            state={state}
            position={position}
            navigation={navigation}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default HomeTabBar;
