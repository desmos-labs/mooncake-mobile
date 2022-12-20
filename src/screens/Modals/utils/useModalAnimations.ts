import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {Gesture} from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animation hook for every bottom-up modal
 * modalThreshold: optional threshold value
 */
const useModalAnimations = (modalThreshold?: number) => {
  const {pop} = useNavigation<any['navigation']>();

  const yOffset = useSharedValue(0);
  const hideThreshold = useSharedValue(0);

  useEffect(() => {
    if (modalThreshold) {
      hideThreshold.value = modalThreshold;
    }
  }, [modalThreshold]);

  /**
   * Animation driver
   */
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onChange(event => {
      const {changeY} = event;
      const newValue = yOffset.value + changeY;
      if (newValue > 0) {
        yOffset.value = newValue;
      }
    })
    .onEnd(() => {
      if (yOffset.value > hideThreshold.value) {
        pop();
      } else {
        yOffset.value = withTiming(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: yOffset.value}],
    };
  });

  return {
    panGesture,
    animatedStyle,
  };
};

export default useModalAnimations;
