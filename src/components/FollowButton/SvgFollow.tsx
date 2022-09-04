import React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SVGComponent = (props: SvgProps) => (
  <Svg
    width={83}
    height={32}
    viewBox="0 0 83 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect width={83} height={32} rx={12} fill="url(#g)" />
    <Defs>
      <LinearGradient
        id="g"
        x1={87.648}
        y1={-41.6}
        x2={73.1142}
        y2={75.4387}
        gradientUnits="userSpaceOnUse">
        <Stop stopColor="#FF3E9A" />
        <Stop offset={0.17662} stopColor="#FFC75B" />
        <Stop offset={0.703066} stopColor="#FF844F" />
        <Stop offset={0.885417} stopColor="#FFD771" />
      </LinearGradient>
    </Defs>
  </Svg>
);

export default SVGComponent;
