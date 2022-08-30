import React from 'react';
import {ColorValue, ViewProps, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import {Shadow} from 'react-native-shadow-2';
import useStyles from './useStyles';

export type Props = ViewProps & {
  innerStyle?: ViewStyle;

  /**
   * Override the base shadow color.
   */
  customColor?: ColorValue;

  customDistance?: number;

  /**
   * Override the overlay shadow color. The Overlay shadow is a secondary
   * shadow that can be used to make the shadow effect appear darker or to put
   * emphasis on the wrapped component.
   */
  customOverlayColor?: ColorValue;

  /**
   * Disable the inner "emphasis" shadow (customOverlayColor will no longer have any effect)
   */
  disableInnerWrapper?: boolean;
};

const DropShadowWrapper: React.FC<Props> = props => {
  const {
    children,
    style,
    innerStyle,
    customColor,
    customDistance,
    customOverlayColor,
    disableInnerWrapper,
  } = props;
  const styles = useStyles();
  const theme = useTheme();
  if (disableInnerWrapper) {
    return (
      <Shadow
        viewStyle={[style, styles.externalShadow]}
        startColor={(customColor as any) || 'rgba(37, 87, 188, 0.1)'}
        distance={40}
        offset={[10, 20]}
        radius={theme.roundness}>
        {children}
      </Shadow>
    );
  }

  return (
    <Shadow
      viewStyle={[style, styles.externalShadow]}
      startColor={(customColor as any) || 'rgba(37, 87, 188, 0.1)'}
      distance={40}
      offset={[10, 20]}
      radius={theme.roundness}>
      <Shadow
        viewStyle={[innerStyle, styles.innerShadow]}
        startColor={(customOverlayColor as any) || 'rgba(16, 24, 40, 0.05)'}
        distance={customDistance || 10}
        offset={[0, 1]}
        // fix for android crash
        // nested shadows can't have the same radius, it seems
        radius={theme.roundness + 1}>
        {children}
      </Shadow>
    </Shadow>
  );
};

export default DropShadowWrapper;
