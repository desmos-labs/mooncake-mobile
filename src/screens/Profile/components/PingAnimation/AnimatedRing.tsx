import React from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ColorValue, StyleSheet } from 'react-native';

type Props = {
  /**
   * The start delay of the ring.
   */
  delay: number;

  /**
   * The color of the ring.
   */
  color: ColorValue;

  /**
   * The size of the ring.
   */
  size: number;
};

const AnimatedRing = ({ delay, color, size }: Props) => {
  const ring = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.8 - ring.value,
      transform: [
        {
          scale: interpolate(ring.value, [0, 1], [0, 4]),
        },
      ],
    };
  });

  React.useEffect(() => {
    ring.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 2500,
        }),
        -1,
      ),
    );
  }, [delay, ring]);

  return (
    <Animated.View
      style={[
        styles.ring,
        { borderColor: color, height: size, width: size, borderRadius: size },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ring: {
    borderWidth: 8,
    position: 'absolute',
  },
});

export default AnimatedRing;
