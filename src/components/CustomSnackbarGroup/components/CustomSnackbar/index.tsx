import Button from 'components/Button';
import Typography from 'components/Typography';
import React, {useEffect} from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import useStyles from './useStyles';

interface Props {
  label: string;
  onSwipeUp: () => void;
  onHide: () => void;
  autoHide: boolean;
  autoHideMs?: number;
}

const CustomSnackbar = ({
  label,
  onSwipeUp,
  onHide,
  autoHide,
  autoHideMs,
}: Props): JSX.Element => {
  const styles = useStyles();
  const opacity = useSharedValue(0);
  const positionY = useSharedValue(-120);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{translateY: positionY.value}],
    };
  });

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 1000});
    positionY.value = withSpring(20);
  }, []);

  useEffect(() => {
    if (autoHide && autoHideMs) {
      setTimeout(() => {
        opacity.value = withTiming(0, {duration: 500});
        positionY.value = withTiming(-1000, {
          duration: 4000,
        });
        setTimeout(() => onHide(), 500);
      }, autoHideMs);
    }
  }, []);

  const swipeUpGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onEnd(event => {
          const {velocityX, velocityY} = event;

          if (Math.abs(velocityX) < 1000 && velocityY < -500) {
            opacity.value = withTiming(0, {duration: 500});
            positionY.value = withTiming(-1000, {
              duration: 4000,
            });
            setTimeout(() => onSwipeUp(), 500);
          }
        }),
    [],
  );

  return (
    <GestureDetector gesture={swipeUpGesture}>
      <Animated.View
        style={[styles.commonToastStyle, animatedStyle]}
        key={label}>
        <Typography.Body6 style={{alignSelf: 'center'}}>
          {label}
        </Typography.Body6>
        <Button
          style={styles.button}
          mode="text"
          onPress={() => console.log('test')}>
          <Typography.Subtitle3>test</Typography.Subtitle3>
        </Button>
      </Animated.View>
    </GestureDetector>
  );
};

export default CustomSnackbar;
