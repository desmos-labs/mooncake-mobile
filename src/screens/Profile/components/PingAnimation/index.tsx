import CommonStyles from 'config/theme/CommonStyles';
import React from 'react';
import { ColorValue, View } from 'react-native';
import AnimatedRing from './AnimatedRing';

interface PingAnimationProps {
  /**
   * The size of the ping.
   */
  size: number;

  /**
   * The color of the ping.
   */
  color: ColorValue;
}

/**
 * A component that displays a ping animation.
 * @constructor
 */
const PingAnimation = (props: PingAnimationProps) => {
  const { size, color } = props;

  return (
    <View style={[CommonStyles.flex['1'], CommonStyles.center]}>
      <AnimatedRing {...props} delay={0} />
      <AnimatedRing {...props} delay={1000} />
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: size / 2,
        }}
      />
    </View>
  );
};

export default PingAnimation;
