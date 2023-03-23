import React from 'react';
import { useTheme, useToken, Button } from 'native-base';
import { TypographyStyles } from 'components/Typography';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';

export const useMakeButtonTypography = () => {
  const defaultTextColor = useToken('colors', ['surfaceBlack'][0]);

  return React.useCallback(
    ({ size, textColor }: any) => {
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
    },
    [defaultTextColor],
  );
};

export const useMakeButtonStyle = () => {
  const theme = useTheme();

  return React.useCallback(
    ({
      variant,
      backgroundColor,
      borderColor,
    }: {
      variant: Pick<React.ComponentProps<typeof Button>, 'variant'>;
      backgroundColor?: string;
      borderColor?: string;
    }) => {
      const variantStyleMap: { [index: string]: any } = {
        solid: {
          backgroundColor: backgroundColor || theme.colors.primary,
        },
        link: {
          textDecorationLine: 'none',
        },
        outlined: {
          borderColor: borderColor || theme.colors.surfaceBlack,
          borderWidth: 1,
        },
      };

      return variantStyleMap[variant as string];
    },
    [theme.colors.primary, theme.colors.surfaceBlack],
  );
};
