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

export enum ButtonMode {
  CONTAINED = 'contained',
  OUTLINED = 'outlined',
  TEXT = 'text',
}

export enum ButtonSize {
  XS = 26,
  S = 32,
  M = 44,
  L = 56,
}

export interface ButtonProps
  extends TouchableOpacityProps,
    Pick<PressableProps, 'android_ripple'> {
  /** Defined Figma modes
   *  CONTAINED = 'contained',
   *  OUTLINED = 'outlined',
   *  TEXT = 'text',
   */
  mode: ButtonMode;
  /** Defined Figma sized
   *   XS = 26,
   *   S = 32,
   *   M = 44,
   *   L = 56,
   */
  size: ButtonSize;
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
  /**
   * Display a loading component (be sure to increment the width dinamically inside small buttons)
   */
  loading?: boolean;
}

/**
 * This HOC should be used to have a correct animation of the button in iOS as well,
 * since the Pressable does not have a consistent animation with both operating systems
 */
const Button = ({children, ...rest}: ButtonProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const styleMap: {[index: string]: any} = {
    [ButtonMode.TEXT]: styles.text,
    [ButtonMode.CONTAINED]: styles.contained,
    [ButtonMode.OUTLINED]: styles.outlined,
  };

  const sizeMap: {[index: string]: any} = {
    [ButtonSize.XS]: styles.h26,
    [ButtonSize.S]: styles.h32,
    [ButtonSize.M]: styles.h44,
    [ButtonSize.L]: styles.h56,
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
