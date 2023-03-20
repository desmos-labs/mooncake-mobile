import React, { FC } from 'react';
import { useTheme, useToken } from 'native-base';
import { TextProps } from 'react-native';
import Typography from 'components/Typography';
import _ from 'lodash';

export const useMakeButtonTextComponent = () => {
  const defaultTextColor = useToken('colors', ['surfaceBlack'][0]);

  const typographyMap: { [index: number]: FC<TextProps> } = {
    56: Typography.Subtitle2,
    44: Typography.Button2,
    32: Typography.Button3,
    26: Typography.Button3,
  };

  return React.useCallback(
    ({ size, textColor, children }: any) => {
      const MappedTextComponent: FC<TextProps> = typographyMap[size as number];

      const textStyle = {
        color: textColor || defaultTextColor,
      };

      return <MappedTextComponent style={textStyle}>{children as string}</MappedTextComponent>;
    },
    [defaultTextColor, typographyMap],
  );
};

export const useMakeButtonProps = () => {
  const theme = useTheme();

  return React.useCallback(
    ({ mode, buttonColor }: { mode: string; buttonColor?: string }) => {
      let variantStyle;

      const baseStyles = {
        _pressed: {
          opacity: 0.4,
        },
        _hover: {
          opacity: 0.8,
        },
        opacity: 1,
        rounded: theme.roundness,
      };

      if (mode === 'contained') {
        variantStyle = {
          backgroundColor: buttonColor || theme.colors.primary,
          variant: 'solid',
        };
      } else if (mode === 'text') {
        variantStyle = {
          variant: 'link',
        };
      } else if (mode === 'outlined') {
        variantStyle = {
          variant: 'solid',
          borderColor: buttonColor || theme.colors.surfaceBlack,
          borderWidth: 1,
        };
      }

      return _.merge(baseStyles, variantStyle);
    },
    [theme.colors.primary, theme.colors.surfaceBlack, theme.roundness],
  );
};
