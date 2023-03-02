import React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { checkboxChecked, checkboxUnchecked } from 'assets/images';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { makeStyle } from 'config/theme';

type Props = {
  /**
   * Is the checkbox checked?
   */
  checked?: boolean;

  /**
   * What to do when the checkbox is pressed.
   */
  handlePress: () => void;

  /**
   * Whether to show the error version of the checkbox.
   */
  error?: boolean;

  /**
   * Override a11y label for unit testing/screen readers
   * @default custom-checkbox
   */
  accessibilityLabel?: string;
  testID?: string;
};

/**
 * A checkmark component with a custom animation when checked/unchecked.
 */
const CustomCheckbox = ({
  checked,
  handlePress,
  error,
  accessibilityLabel = 'custom-checkbox',
  testID,
}: Props) => {
  const styles = useStyles();

  const animatedCheckStyle = useAnimatedStyle(() => {
    const scale = withSpring(checked ? 1.0 : 0.7);

    const opacity = withSpring(checked ? 1.0 : 0);

    return {
      opacity,
      transform: [{ scale }],
    };
  });

  return (
    <TouchableOpacity testID={testID} accessibilityLabel={accessibilityLabel} onPress={handlePress}>
      <Image
        source={checkboxUnchecked}
        style={[styles.image, error && styles.errorTint, checked && styles.checkedTint]}
      />
      <Animated.Image
        source={checkboxChecked}
        style={[StyleSheet.absoluteFillObject, styles.image, animatedCheckStyle]}
      />
    </TouchableOpacity>
  );
};

const useStyles = makeStyle(theme => ({
  image: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
  errorTint: {
    tintColor: theme.colors.error,
  },
  checkedTint: {
    tintColor: theme.colors.accentGreen01,
  },
}));

export default CustomCheckbox;
