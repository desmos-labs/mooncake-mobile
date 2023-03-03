import React from 'react';
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
// @ts-ignore Ignoring errors since typescript does not recognize the alias
import GenericButton from 'components/Button/components/GenericButton'; // eslint-disable-line import/no-unresolved
import useStyles from './useStyles';

/** Defined Figma modes
 *  CONTAINED = 'contained',
 *  OUTLINED = 'outlined',
 *  TEXT = 'text',
 */
export enum ButtonMode {
  CONTAINED = 'contained',
  OUTLINED = 'outlined',
  TEXT = 'text',
}

/** Defined Figma sized
 *   XS = 26,
 *   S = 32,
 *   M = 44,
 *   L = 56,
 */
export enum ButtonSize {
  XS = 26,
  S = 32,
  M = 44,
  L = 56,
}

/**
 * Button props
 * @typedef {Object} ButtonProps
 * @property {ButtonMode} mode - Defined Figma modes
 * @property {ButtonSize} size - Defined Figma sized
 * @property {StyleProp<ViewStyle>} additionalStyle - Additional style
 * @property {string} backgroundColor - Background color, default white
 * @property {string} textColor - Text color, default surfaceBlack
 * @property {boolean} useSubtitle - Use subtitle2 instead of button2 as text component
 * @property {boolean} loading - Display a loading component (be sure to increment the width dinamically inside small buttons)
 * @property {TouchableOpacityProps} TouchableOpacityProps - TouchableOpacityProps
 */
export interface ButtonProps extends TouchableOpacityProps {
  mode: ButtonMode;
  size: ButtonSize;
  additionalStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  textColor?: string;
  useSubtitle?: boolean;
  loading?: boolean;
}

/**
 * This HOC should be used to have a correct animation of the button in iOS as well,
 * since the Pressable does not have a consistent animation with both operating systems
 * @param props ButtonProps
 */
const Button = ({ children, ...rest }: ButtonProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const styleMap: { [index: string]: any } = {
    [ButtonMode.TEXT]: styles.text,
    [ButtonMode.CONTAINED]: styles.contained,
    [ButtonMode.OUTLINED]: styles.outlined,
  };

  const sizeMap: { [index: string]: any } = {
    [ButtonSize.XS]: styles.h26,
    [ButtonSize.S]: styles.h32,
    [ButtonSize.M]: styles.h44,
    [ButtonSize.L]: styles.h56,
  };

  return (
    <GenericButton styles={styles} theme={theme} styleMap={styleMap} sizeMap={sizeMap} {...rest}>
      {children}
    </GenericButton>
  );
};

export default Button;
