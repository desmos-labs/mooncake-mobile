import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animations for the PostTypeTab component.
 */
const useAnimations = () => {
  const offset = useSharedValue(0);

  const setOffset = (value: number) => (offset.value = withTiming(value));

  const animatedStyles = useAnimatedStyle(() => {
    return {
      left: `${offset.value}%`,
    };
  });

  return {
    setOffset,
    animatedStyles,
  };
};

export default useAnimations;
