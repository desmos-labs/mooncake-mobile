import React from 'react';
import { Button as NBButton, useTheme, useToken } from 'native-base';
import { ColorType } from 'native-base/lib/typescript/components/types';
import _ from 'lodash';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import { TypographyStyles } from 'components/Typography';

interface Props
  extends Omit<
    React.ComponentProps<typeof NBButton>,
    'shadow' | '_pressed' | 'hover' | 'opacity' | 'color' | 'colorScheme' | '_text'
  > {
  /**
   * The relative height of the button.
   */
  size?: 26 | 32 | 44 | 56;

  /**
   * The text that will be rendered on the button.
   */
  children?: string;

  /**
   * Optionally override the default button text color.
   */
  textColor?: ColorType;

  /**
   * Change the background color of the button.
   */
  backgroundColor?: ColorType;

  /**
   * Change the outline/border color of the button. Only relevant for outlined variant.
   */
  borderColor?: ColorType;

  /**
   * What to do when the button is pressed.
   */
  onPress?: () => void;
}

/**
 * A button component based on the native-base Button.
 * @constructor
 */
const Button = ({
  size = 56,
  variant = 'solid',
  backgroundColor,
  borderColor,
  textColor,
  children,
  ...rest
}: Props) => {
  const theme = useTheme();
  const defaultTextColor = useToken('colors', ['surfaceBlack'][0]);

  const paddingY = () => {
    switch (size) {
      case 56:
        return 16;
      case 44:
        return 12;
      case 32:
        return 8;
      case 26:
        return 2;
      default:
        return 0;
    }
  };

  const buttonTypography = React.useMemo(() => {
    const sizeToTypographyMap: { [index: number]: StyleProp<TextStyle> } = {
      56: TypographyStyles.Subtitle2,
      44: TypographyStyles.Button2,
      32: TypographyStyles.Button3,
      26: TypographyStyles.Button3,
    };

    const typographyStyle = sizeToTypographyMap[size as number];

    return {
      _text: StyleSheet.flatten([
        typographyStyle,
        {
          color: textColor || defaultTextColor,
          numberOfLines: 1,
        },
      ]),
    };
  }, [defaultTextColor, size, textColor]);

  const buttonStyle = React.useMemo(() => {
    const backgroundColorFromTheme = _.get(theme, `colors.${backgroundColor}`, backgroundColor);
    const borderColorFromTheme = _.get(theme, `colors.${borderColor}`, borderColor);

    const variantStyleMap: { [index: string]: any } = {
      solid: {
        backgroundColor: backgroundColorFromTheme || theme.colors.primary,
      },
      link: {
        textDecorationLine: 'none',
      },
      outlined: {
        borderColor: borderColorFromTheme || theme.colors.surfaceBlack,
        borderWidth: 1,
      },
    };

    return variantStyleMap[variant as string];
  }, [backgroundColor, borderColor, theme, variant]);

  return (
    <NBButton
      py={`${paddingY()}px`}
      isDisabled={rest.disabled || rest.isDisabled}
      _disabled={{
        backgroundColor: 'tabIconGrey',
      }}
      {...buttonTypography}
      // can ignore this error as variant has a default value of solid
      // @ts-ignore
      {...buttonStyle}
      {...rest}>
      {children}
    </NBButton>
  );
};

export default Button;
