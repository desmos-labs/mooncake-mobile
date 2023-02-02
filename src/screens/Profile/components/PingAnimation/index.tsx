import React from 'react';
import { ColorValue, View } from 'react-native';
import AnimatedRing from './AnimatedRing';

type Props = {
  /**
   * The size of the ping.
   */
  size: number;

  /**
   * The color of the ping.
   */
  color: ColorValue;
};

const PingAnimation = (props: Props) => {
  const { size, color } = props;

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
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
