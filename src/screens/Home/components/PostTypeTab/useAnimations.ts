import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
