import React from 'react';
import {ColorValue, ViewProps, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
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
};

const DropShadowWrapper: React.FC<Props> = props => {
  const styles = useStyles();
  const theme = useTheme();

  const {
    children,
    innerStyle,
    customColor,
    customDistance,
    customOverlayColor,
    disableInnerWrapper,
    innerShadowProps,
    outerShadowProps,
  } = props;
  if (disableInnerWrapper) {
    return (
      <Shadow
        viewStyle={[innerStyle, styles.externalShadow]}
        startColor={(customColor as any) || 'rgba(37, 87, 188, 0.1)'}
        distance={40}
        offset={[10, 20]}
        radius={theme.roundness}
        {...outerShadowProps}>
        {children}
      </Shadow>
    );
  }

  return (
    <Shadow {...outerShadowProps}>
      <Shadow
        viewStyle={[innerStyle, styles.innerShadow]}
        startColor={(customOverlayColor as any) || 'rgba(16, 24, 40, 0.04)'}
        distance={customDistance || 6}
        radius={theme.roundness + 1}
        {...innerShadowProps}>
        {children}
      </Shadow>
    </Shadow>
  );
};

export default DropShadowWrapper;
