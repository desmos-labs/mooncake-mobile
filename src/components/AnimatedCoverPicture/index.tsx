import { makeStyleWithProps } from 'config/theme';
import CommonStyles from 'config/theme/CommonStyles';
import { BlurView } from 'expo-blur';
import { ImageSource } from 'expo-image';
import { ImageBackground } from 'expo-image/src/ImageBackground';
import React from 'react';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface Props {
  picture: string | ImageSource | undefined;
  pictureHash?: string | null;
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
  scrollY: SharedValue<number>;
  heightFixed: number;
  blurIntensity?: number;
  fixedBlur?: boolean;
}

/**
 * Animated banner picture
 * @param pictureUri - Picture URI
 * @param scrollY - Scroll value
 * @param heightFixed - Fixed height
 * @constructor
 */
const AnimatedCoverPicture = ({
  picture,
  pictureHash,
  scrollY,
  heightFixed,
  cachePolicy,
  fixedBlur,
  blurIntensity,
}: Props) => {
  const styles = useStyles(heightFixed);
  const { top } = useSafeAreaInsets();
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
    const opacity = interpolate(scrollY.value, [-60, 0, 25, 120], [1, 0, 0, 1]);

    return {
      opacity,
    };
  });

  const animatedBlurStyleAndroid = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [-50, 0, 25, 60], [0.1, 0, 0, 0.1]);

    return {
      opacity,
    };
  });

  return (
    <AnimatedImage
      contentFit="cover"
      placeholderContentFit="cover"
      source={picture}
      placeholder={pictureHash || ''}
      transition={250}
      cachePolicy={cachePolicy ?? 'memory-disk'}
      style={[styles.banner, animatedImageBGStyle, Platform.OS === 'android' && { top }]}>
      <Animated.View
        style={[CommonStyles.flex['1'], fixedBlur ? { opacity: 1 } : animatedBlurStyle]}>
        {Platform.OS === 'ios' ? (
          <AnimatedBlurView
            tint="dark"
            intensity={blurIntensity ?? 96}
            style={[styles.bannerBlur]}
          />
        ) : (
          <Animated.View
            style={[styles.bannerBlur, styles.blurViewAndroid, animatedBlurStyleAndroid]}
          />
        )}
      </Animated.View>
    </AnimatedImage>
  );
};

// Inline styles since they are not used anywhere else
const useStyles = makeStyleWithProps((heightFixed: number, theme) => ({
  banner: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
    width: Dimensions.get('window').width,
    height: heightFixed,
    backgroundColor: theme.colors.lightGrey01,
  },
  bannerBlur: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  blurViewAndroid: {
    backgroundColor: 'black',
  },
}));

export default AnimatedCoverPicture;
