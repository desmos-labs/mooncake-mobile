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

  /**
   * Override the overlay shadow color. The Overlay shadow is a secondary
   * shadow that can be used to make the shadow effect appear darker or to put
   * emphasis on the wrapped component.
   */
  customOverlayColor?: ColorValue;
};

const DropShadowWrapper: React.FC<Props> = props => {
  const {children, style, innerStyle, customColor, customOverlayColor} = props;
  const styles = useStyles();
  const theme = useTheme();
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
        distance={10}
        offset={[0, 1]}
        radius={theme.roundness}>
        {children}
      </Shadow>
    </Shadow>
  );
};

export default DropShadowWrapper;
