import { useNavigation, useTheme } from '@react-navigation/native';
import { useEffect } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Extrapolate,
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { toRad, transformOrigin } from 'react-native-redash';

/**
 * Animation hook for every bottom-up modal
 * modalThreshold: optional threshold value
 */
const useModalAnimations = (modalThreshold?: number) => {
  const { goBack } = useNavigation<any['navigation']>();
  const theme = useTheme();
  const yOffset = useSharedValue(0);
  const hideThreshold = useSharedValue(0);

  useEffect(() => {
    if (modalThreshold) {
      hideThreshold.value = modalThreshold;
    }
  }, [hideThreshold, modalThreshold]);

  /**
   * Animation driver
   */
  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onChange(event => {
      const { changeY } = event;
      const newValue = yOffset.value + changeY;
      if (newValue > 0) {
        yOffset.value = newValue;
      }
    })
    .onEnd(() => {
      if (yOffset.value > hideThreshold.value) {
        goBack();
      } else {
        yOffset.value = withSpring(0, {
          damping: 80,
          overshootClamping: true,
          restDisplacementThreshold: 0.1,
          restSpeedThreshold: 0.1,
          stiffness: 500,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: yOffset.value }],
    };
  });

  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(yOffset.value, [0, modalThreshold || 100], [0, 1], Extrapolate.CLAMP),
  );

  const tabAnimatedStyleLeft = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      yOffset.value,
      [0, modalThreshold! || 100],
      [0, toRad(30)],
      Extrapolation.CLAMP,
    );

    const marginTop = interpolate(
      yOffset.value,
      [0, modalThreshold! || 100],
      [2, 6],
      Extrapolation.CLAMP,
    );

    const backgroundColor = interpolateColor(
      yOffset.value,
      [0, modalThreshold! || 100],
      [theme.colors.neutralVariants['300'], theme.colors.neutralVariants['600']],
    );
    return {
      backgroundColor,
      marginTop,
      transform: transformOrigin({ x: 0, y: indicatorTransformOriginY.value }, [
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -8,
        },
      ]),
    };
  });

  const tabAnimatedStyleRight = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      yOffset.value,
      [0, modalThreshold! || 100],
      [0, toRad(-30)],
      Extrapolation.CLAMP,
    );

    const marginTop = interpolate(
      yOffset.value,
      [0, modalThreshold! || 100],
      [2, 6],
      Extrapolation.CLAMP,
    );

    const backgroundColor = interpolateColor(
      yOffset.value,
      [0, modalThreshold! || 100],
      [theme.colors.neutralVariants['300'], theme.colors.neutralVariants['600']],
    );
    return {
      backgroundColor,
      marginTop,
      transform: transformOrigin({ x: 0, y: indicatorTransformOriginY.value }, [
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 8,
        },
      ]),
    };
  });

  return {
    panGesture,
    animatedStyle,
    tabAnimatedStyleLeft,
    tabAnimatedStyleRight,
  };
};

export default useModalAnimations;
