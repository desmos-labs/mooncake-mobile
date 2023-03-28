import React from 'react';
import { getCoverPicture } from 'lib/ProfileUtils';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ImageBackground, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { DesmosProfile } from 'types/desmos';
import { makeStyle } from 'config/theme';
import { HEADER_HEIGHT_COMPACT, HEADER_HEIGHT_EXPANDED } from 'screens/Profile';

const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface Props {
  profile: DesmosProfile;
  scrollY: SharedValue<number>;
}

/**
 * Animated banner picture
 * @param profile - Profile to get the picture from
 * @param scrollY - Scroll value
 * @constructor
 */
const AnimatedBannerPicture = ({ profile, scrollY }: Props) => {
  const styles = useStyles();

  const animatedImageBGStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [-200, 0], [5, 1], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.EXTEND,
    });

    return {
      transform: [{ scale }],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [-50, 0, 50, 100], [1, 0, 0, 1]);

    return {
      opacity,
    };
  });

  return (
    <AnimatedImageBackground
      resizeMode="cover"
      source={getCoverPicture(profile)}
      style={[styles.banner, animatedImageBGStyle]}>
      <AnimatedBlurView
        blurType="dark"
        blurAmount={96}
        style={[styles.bannerBlur, animatedBlurStyle]}
      />
    </AnimatedImageBackground>
  );
};

// Inline styles since they are not used anywhere else
const useStyles = makeStyle(() => ({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
    height: HEADER_HEIGHT_EXPANDED + HEADER_HEIGHT_COMPACT,
  },
  bannerBlur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
}));

export default AnimatedBannerPicture;
