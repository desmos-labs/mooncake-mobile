import React from 'react';
import { ColorValue, View } from 'react-native';
import { Center } from 'native-base';
import AnimatedRing from './AnimatedRing';

export interface PingAnimationProps {
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
    <Center>
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
    </Center>
  );
};

export default PingAnimation;
