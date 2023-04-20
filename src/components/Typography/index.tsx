import React, { useMemo } from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { ICustomTheme, useTheme } from 'native-base';

export type TypographyComponentProps = React.ComponentProps<typeof Text>;

function createTextComponent(
  styleProvider: (_theme: ICustomTheme) => StyleProp<TextStyle>,
): React.FC<TypographyComponentProps> {
  return props => {
    const { style } = props;
    const theme = useTheme();
    const themeStyle = useMemo(() => styleProvider(theme), [theme]);

    const commonStyle = useMemo<StyleProp<TextStyle>>(
      () => ({
        color: theme.colors.surfaceBlack,
      }),
      [theme],
    );

    return <Text {...props} style={StyleSheet.compose([commonStyle, themeStyle], style)} />;
  };
}

export const TypographyStyles: { [index: string]: StyleProp<TextStyle> } = {
  Display1: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 64,
    letterSpacing: -0.015,
  },
  Display2: {
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontSize: 54,
    letterSpacing: -0.005,
  },
  Display3: {
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 48,
    lineHeight: 72,
  },
  H1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'left',
  },
  H2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  H3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  H4: {
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 22,
    letterSpacing: 0.0015,
  },
  H5: {
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: -0.0015,
  },
  H6: {
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    letterSpacing: -0.0015,
  },
  Subtitle1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.015,
    textAlign: 'left',
  },
  Subtitle2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.001,
    textAlign: 'left',
    lineHeight: 24,
  },
  Subtitle3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.0125,
    textAlign: 'left',
  },
  Subtitle4: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    textAlign: 'left',
  },
  Body1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  Body2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  Body3: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  Body4: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  Body5: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.005,
    textAlign: 'left',
  },
  Body6: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.025,
    textAlign: 'left',
  },
  Body7: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  },
  Link1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'left',
  },
  Button1: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.0015,
    textAlign: 'left',
  },
  Button2: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: 0.015,
    textAlign: 'left',
  },
  Button3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.015,
    textAlign: 'left',
    lineHeight: 18,
  },
  Caption1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.004,
    textAlign: 'left',
  },
  Caption2: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 0.004,
    textAlign: 'left',
  },
  Caption3: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '600',
    letterSpacing: 0.004,
    textAlign: 'left',
  },
};

const Typography = {
  Display1: createTextComponent(() => TypographyStyles.Display1),
  Display2: createTextComponent(() => TypographyStyles.Display2),
  Display3: createTextComponent(() => TypographyStyles.Display3),
  H1: createTextComponent(() => TypographyStyles.H1),
  H2: createTextComponent(() => TypographyStyles.H2),
  H3: createTextComponent(() => TypographyStyles.H3),
  H4: createTextComponent(() => TypographyStyles.H4),
  H5: createTextComponent(() => TypographyStyles.H5),
  H6: createTextComponent(() => TypographyStyles.H6),
  Subtitle1: createTextComponent(() => TypographyStyles.Subtitle1),
  Subtitle2: createTextComponent(() => TypographyStyles.Subtitle2),
  Subtitle3: createTextComponent(() => TypographyStyles.Subtitle3),
  Subtitle4: createTextComponent(() => TypographyStyles.Subtitle4),
  Body1: createTextComponent(() => TypographyStyles.Body1),
  Body2: createTextComponent(() => TypographyStyles.Body2),
  Body3: createTextComponent(() => TypographyStyles.Body3),
  Body4: createTextComponent(() => TypographyStyles.Body4),
  Body5: createTextComponent(() => TypographyStyles.Body5),
  Body6: createTextComponent(() => TypographyStyles.Body6),
  Body7: createTextComponent(() => TypographyStyles.Body7),
  Link1: createTextComponent(() => TypographyStyles.Link1),
  Button1: createTextComponent(() => TypographyStyles.Button1),
  Button2: createTextComponent(() => TypographyStyles.Button2),
  Button3: createTextComponent(() => TypographyStyles.Button3),
  Caption1: createTextComponent(() => TypographyStyles.Caption1),
  Caption2: createTextComponent(() => TypographyStyles.Caption2),
  Caption3: createTextComponent(() => TypographyStyles.Caption3),
};

export default Typography;
