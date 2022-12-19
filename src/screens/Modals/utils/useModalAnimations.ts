import {useNavigation} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import {Gesture} from 'react-native-gesture-handler';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animation hook for the PostInteractionTabs tab navigator
 */
const useModalAnimations = () => {
  const {pop} = useNavigation<any['navigation']>();

  const yOffset = useSharedValue(0);
  const hideThreshold = useSharedValue(Dimensions.get('window').height);

  /**
   * Animation driver
   */
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onChange(event => {
      const {changeY} = event;
      console.log(yOffset.value);
      // TODO: these threshold values should be tweaked
      // also handle swipe action
      const newValue = yOffset.value + changeY;
      if (newValue < 800 && newValue > 0) {
        yOffset.value = newValue;
      }
    })
    .onEnd(() => {
      if (yOffset.value > 100 && yOffset.value < hideThreshold.value) {
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
