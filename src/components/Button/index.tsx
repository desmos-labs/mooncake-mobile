import React from 'react';
import {
  Platform,
  PressableProps,
  StyleProp,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import IOSButton from 'components/Button/components/IOSButton';
import AndroidButton from 'components/Button/components/AndroidButton';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export interface ButtonProps
  extends TouchableOpacityProps,
    Pick<PressableProps, 'android_ripple'> {
  /** Defined Figma modes
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  mode: 'text' | 'outlined' | 'contained';
  /** Defined Figma sized
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  size: 26 | 32 | 44 | 56;
  /**
   * Additional style
   */
  additionalStyle?: StyleProp<ViewStyle>;
  /**
   * Background color, default white
   */
  backgroundColor?: string;
  /**
   * Text color, default surfaceBlack
   */
  textColor?: string;
  /**
   * Use subtitle2 instead of button2 as text component
   */
  useSubtitle?: boolean;
}

/**
 * This HOC should be used to have a correct animation of the button in iOS as well,
 * since the Pressable does not have a consistent animation with both operating systems
 */
const Button = ({children, ...rest}: ButtonProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const styleMap: {[index: string]: any} = {
    text: styles.text,
    contained: styles.contained,
    outlined: styles.outlined,
  };

  const sizeMap: {[index: string]: any} = {
    26: styles.h26,
    32: styles.h32,
    44: styles.h44,
    56: styles.h56,
  };

  if (Platform.OS === 'ios') {
    return (
      <IOSButton
        styles={styles}
        theme={theme}
        styleMap={styleMap}
        sizeMap={sizeMap}
        {...rest}>
        {children}
      </IOSButton>
    );
  }

  return (
    <AndroidButton
      styles={styles}
      theme={theme}
      styleMap={styleMap}
      sizeMap={sizeMap}
      {...rest}>
      {children}
    </AndroidButton>
  );
};

export default Button;
