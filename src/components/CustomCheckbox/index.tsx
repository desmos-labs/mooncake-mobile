import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {checkboxChecked, checkboxUnchecked} from 'assets/images';
import Animated, {useAnimatedStyle, withSpring} from 'react-native-reanimated';

type Props = {
  /**
   * Is the checkbox checked?
   */
  checked: boolean;

  /**
   * What to do when the checkbox is pressed.
   */
  handlePress: () => void;
};

/**
 * A checkmark component with a custom animation when checked/unchecked.
 */
const CustomCheckbox = ({checked, handlePress}: Props) => {
  const animatedCheckStyle = useAnimatedStyle(() => {
    const scale = withSpring(checked ? 1.0 : 0.7);

    const opacity = withSpring(checked ? 1.0 : 0);

    return {
      opacity,
      transform: [{scale}],
    };
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Image source={checkboxUnchecked} style={styles.image} />
      <Animated.Image
        source={checkboxChecked}
        style={[
          StyleSheet.absoluteFillObject,
          styles.image,
          animatedCheckStyle,
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 24,
    resizeMode: 'contain',
    width: 24,
  },
});

export default CustomCheckbox;
