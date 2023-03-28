import React from 'react';
import { getProfilePicture } from 'lib/ProfileUtils';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { DesmosProfile } from 'types/desmos';
import { makeStyle } from 'config/theme';
import FastImage from 'react-native-fast-image';
import { HEADER_HEIGHT_EXPANDED } from 'screens/Profile';

// @ts-ignore
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);

interface Props {
  profile: DesmosProfile;
  scrollY: SharedValue<number>;
  scrollOffset: SharedValue<number>;
}

/**
 * Animated profile picture
 * @param profile - Profile to get the picture from
 * @param scrollY - Scroll value
 * @param scrollOffset - Scroll offset
 * @constructor
 */
const AnimatedProfilePicture = ({ profile, scrollY, scrollOffset }: Props) => {
  const styles = useStyles();

  const animatedProfilePicStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [1, 0.5], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const translateY = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [0, 46], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const top = scrollOffset.value;
    const opacity = interpolate(scrollY.value, [0, HEADER_HEIGHT_EXPANDED], [1, 0], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    return {
      opacity,
      top,
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <AnimatedFastImage
      source={getProfilePicture(profile)}
      style={[styles.profileImage, animatedProfilePicStyle]}
    />
  );
};

// Inline styles since they are not used anywhere else
const useStyles = makeStyle(theme => ({
  profileImage: {
    zIndex: 2,
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    left: theme.spacing.m,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.white,
  },
}));

export default AnimatedProfilePicture;
