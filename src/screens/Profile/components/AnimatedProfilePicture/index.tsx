import { makeStyle } from 'config/theme';
import { Image, ImageSource } from 'expo-image';
import React from 'react';
import { Pressable } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { PROFILE_HEADER_HEIGHT_EXPANDED } from 'screens/Profile/useStyles';

// @ts-ignore
const AnimatedImage = Animated.createAnimatedComponent(Image);

interface Props {
  picture: string | ImageSource;
  pictureHash?: string | null;
  scrollY: SharedValue<number>;
  scrollOffset: SharedValue<number>;
  /**
   * Determines whether to cache the image and where: on the disk, in the memory or both.
   *
   * - `'none'` - Image is not cached at all.
   *
   * - `'disk'` - Image is queried from the disk cache if exists, otherwise it's downloaded and then stored on the disk.
   *
   * - `'memory'` - Image is cached in memory. Might be useful when you render a high-resolution picture many times.
   * Memory cache may be purged very quickly to prevent high memory usage and the risk of out of memory exceptions.
   *
   * - `'memory-disk'` - Image is cached in memory, but with a fallback to the disk cache.
   *
   * @default 'memory'
   */
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk' | /** @hidden */ null;
  onPress?: () => void;
}

/**
 * Animated profile picture
 * @param profile - Profile to get the picture from
 * @param scrollY - Scroll value
 * @param scrollOffset - Scroll offset
 * @param onPress - On press callback
 * @constructor
 */
const AnimatedProfilePicture = ({
  picture,
  pictureHash,
  scrollY,
  scrollOffset,
  cachePolicy,
  onPress,
}: Props) => {
  const styles = useStyles();

  const animatedProfilePicStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, PROFILE_HEADER_HEIGHT_EXPANDED], [1, 0.5], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const translateY = interpolate(scrollY.value, [0, PROFILE_HEADER_HEIGHT_EXPANDED], [0, 46], {
      extrapolateRight: Extrapolation.CLAMP,
      extrapolateLeft: Extrapolation.CLAMP,
    });

    const top = scrollOffset.value;
    const opacity = interpolate(scrollY.value, [0, PROFILE_HEADER_HEIGHT_EXPANDED], [1, 0], {
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
    <Pressable style={styles.pressable} onTouchStart={onPress}>
      <AnimatedImage
        contentFit="cover"
        placeholderContentFit="cover"
        source={picture}
        placeholder={pictureHash || ''}
        transition={250}
        cachePolicy={cachePolicy ?? 'memory'}
        style={[styles.profileImage, animatedProfilePicStyle]}
      />
    </Pressable>
  );
};

// Inline styles since they are not used anywhere else
const useStyles = makeStyle(theme => ({
  profileImage: {
    zIndex: 4,
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    left: theme.spacing.m,
    borderColor: theme.colors.white,
    backgroundColor: theme.colors.lightGrey01,
  },
  pressable: { zIndex: 5 },
}));

export default AnimatedProfilePicture;
