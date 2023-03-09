import React from 'react';
import { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-shadow-2';
import useStyles from './useStyles';

export type Props = ViewProps & {
  // @deprecated use innerShadowProps instead
  innerStyle?: ViewStyle;

  /**
   * Override the base shadow color.
   * @deprecated use innerShadowProps instead
   */
  customColor?: ColorValue;

  // @deprecated use innerShadowProps instead
  customDistance?: number;

  /**
   * Override the overlay shadow color. The Overlay shadow is a secondary
   * shadow that can be used to make the shadow effect appear darker or to put
   * emphasis on the wrapped component.
   * @deprecated use innerShadowProps instead
   */
  customOverlayColor?: ColorValue;

  /**
   * Disable the inner "emphasis" shadow (customOverlayColor will no longer have any effect)
   * @deprecated use innerShadowProps instead
   */
  disableInnerWrapper?: boolean;

  innerShadowProps?: React.ComponentProps<typeof Shadow>;

  outerShadowProps?: React.ComponentProps<typeof Shadow>;

  style?: StyleProp<ViewStyle>;
};

const DropShadowWrapper: React.FC<Props> = props => {
  const styles = useStyles();

  const {
    children,
    innerStyle,
    customColor,
    customDistance,
    customOverlayColor,
    disableInnerWrapper,
    innerShadowProps,
    outerShadowProps,
    style,
  } = props;
  if (disableInnerWrapper) {
    return (
      <Shadow
        style={[style, styles.externalShadow]}
        stretch={true}
        startColor={(customColor as any) || 'rgba(37, 87, 188, 0.1)'}
        distance={40}
        offset={[10, 20]}
        {...outerShadowProps}>
        {children}
      </Shadow>
    );
  }

  return (
    <Shadow
      stretch={true}
      style={[style, styles.externalShadow]}
      startColor={(customColor as any) || 'rgba(37, 87, 188, 0.1)'}
      distance={40}
      offset={[10, 20]}
      {...outerShadowProps}>
      <Shadow
        stretch={true}
        style={[innerStyle, styles.innerShadow]}
        startColor={(customOverlayColor as any) || 'rgba(16, 24, 40, 0.03)'}
        distance={customDistance || 10}
        offset={[0, 1]}
        {...innerShadowProps}>
        {children}
      </Shadow>
    </Shadow>
  );
};

export default DropShadowWrapper;
