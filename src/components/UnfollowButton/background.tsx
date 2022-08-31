import * as React from 'react';
import Svg, {
  SvgProps,
  Rect,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

const SVGComponent = (props: SvgProps) => (
  <Svg
    width={82}
    height={32}
    viewBox="0 0 82 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Rect x={0.5} y={0.5} width={81} height={31} rx={11.5} fill="white" />
    <Rect
      x={0.5}
      y={0.5}
      width={81}
      height={31}
      rx={11.5}
      stroke="url(#paint0_linear_3910_45233)"
    />
    <Defs>
      <LinearGradient
        id="paint0_linear_3910_45233"
        x1={86.592}
        y1={-41.6}
        x2={71.8864}
        y2={75.3951}
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
