import Button from 'components/Button';
import Typography from 'components/Typography';
import React, {useCallback} from 'react';
import {GestureResponderEvent, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import useStyles from './useStyles';

interface Props {
  /**
   * True for snackbar opened, false for closed
   */
  showSnackbar: boolean;
  /**
   * Modes of the snackbar
   */
  snackBarMode: 'success' | 'failure';
  /**
   * Title of the snackbar (Only failure mode)
   */
  title?: string;
  /**
   * Message of the snackbar (Success mode will display only this message in a different component)
   */
  message?: string;
  /**
   * Label for the button (Only failure mode)
   */
  buttonLabel?: string;
  /**
   * Action for the button (Only failure mode)
   */
  buttonAction: () => void;
  /**
   * Swipe up action
   */
  swipeUpAction: () => void;
  /**
   * Only top position has a swipe gesture working (if we need a bottom one we can implement a swipe down action and use the bottom position)
   */
  position?: 'top' | 'bottom';
}

const CustomSnackbar = ({
  showSnackbar,
  snackBarMode,
  title,
  message,
  position,
  buttonLabel,
  buttonAction,
  swipeUpAction,
}: Props): JSX.Element => {
  const positionY = useSharedValue(position === 'top' ? -100 : 100);
  const styles = useStyles();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: withSpring(positionY.value)}],
    };
  });

  if (showSnackbar) {
    if (position === 'top') {
      positionY.value = 10;
    }
    if (position === 'bottom') {
      positionY.value = -16;
    }
  }

  if (!showSnackbar) {
    if (position === 'top') {
      positionY.value = -160;
    }
    if (position === 'bottom') {
      positionY.value = 160;
    }
  }

  const testFunction = useCallback(
    (event: GestureResponderEvent) => {
      if (event.nativeEvent.locationY <= 0) {
        swipeUpAction();
      }
    },
    [swipeUpAction],
  );

  return (
    <Animated.View
      onStartShouldSetResponder={() => true}
      onResponderRelease={event => testFunction(event)}
      style={[
        styles.commonToastStyle,
        position === 'top' ? styles.topToastStyle : styles.bottomToastStyle,
        snackBarMode === 'success' ? styles.success : styles.failure,
        animatedStyle,
      ]}>
      {snackBarMode === 'failure' ? (
        <View style={styles.textGroup}>
          <Typography.Subtitle3>{title}</Typography.Subtitle3>
          <Typography.Body7>{message}</Typography.Body7>
        </View>
      ) : (
        <Typography.Body6 style={{alignSelf: 'center'}}>
          {message}
        </Typography.Body6>
      )}
      <Button style={styles.button} mode="text" onPress={buttonAction}>
        <Typography.Subtitle3>{buttonLabel}</Typography.Subtitle3>
      </Button>
    </Animated.View>
  );
};

export default CustomSnackbar;
