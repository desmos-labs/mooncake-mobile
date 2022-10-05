import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {Dimensions} from 'react-native';
import {Gesture} from 'react-native-gesture-handler';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';

type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_INTERACTION
>;
/**
 * Animation hook for the PostInteractionTabs tab navigator
 */
const useAnimations = () => {
  const {goBack} = useNavigation<NavProps['navigation']>();
  const {params} = useRoute<NavProps['route']>();

  const expandOnOpen = _.get(params, 'expandOnOpen');
  const allowPanning = _.get(params, 'allowPanning');
  // use shared values as calling Dimensions.get in gesture handler causes it
  // to crash
  const yOffset = useSharedValue(expandOnOpen ? 50 : 500);
  const hideThreshold = useSharedValue(Dimensions.get('window').height * 0.8);

  /**
   * Animation driver
   */
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onChange(event => {
      const {changeY} = event;

      // TODO: these threshold values should be tweaked
      // also handle swipe action
      const newValue = yOffset.value + changeY;
      if (allowPanning && newValue < 800 && newValue > 50) {
        yOffset.value = newValue;
      }
    })
    .onEnd(event => {
      const {velocityY} = event;

      // swipe down
      if (velocityY > 500) {
        goBack();
      }
      // hide component if user lets go and it is below the hideThreshold
      if (yOffset.value > hideThreshold.value) {
        goBack();
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

export default useAnimations;
