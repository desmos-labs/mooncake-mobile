import React, {useMemo} from 'react';
import {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import {useTheme} from 'react-native-paper';

export type TypographyComponentProps = React.ComponentProps<typeof Text>;

function createTextComponent(
  styleProvider: (_theme: ReactNativePaper.Theme) => StyleProp<TextStyle>,
): React.FC<TypographyComponentProps> {
  return props => {
    const {style} = props;
    const theme = useTheme();
    const themeStyle = useMemo(() => styleProvider(theme), [theme]);

    const commonStyle = useMemo<StyleProp<TextStyle>>(
      () => ({
        color: theme.colors.black,
      }),
      [theme],
    );

    return (
      <Text
        {...props}
        style={StyleSheet.compose([commonStyle, themeStyle], style)}
      />
    );
  };
}

const Typography = {
  Display1: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 64,
    lineHeight: 96,
    letterSpacing: -0.015,
  })),
  Display2: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontWeight: '600',
    fontSize: 54,
    lineHeight: 81,
    letterSpacing: -0.005,
  })),
  Display3: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontWeight: '600',
    fontSize: 48,
    lineHeight: 72,
  })),
  H1: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 40,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 60,
    textAlign: 'left',
  })),
  H2: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 32,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 48,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  H3: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 36,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  H4: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 22,
    lineHeight: 33,
    letterSpacing: 0.0015,
  })),
  H5: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.0015,
  })),
  Subtitle1: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 27,
    letterSpacing: 0.015,
    textAlign: 'left',
  })),
  Subtitle2: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.001,
    textAlign: 'left',
  })),
  Subtitle3: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: 0.0125,
    textAlign: 'left',
  })),
  Subtitle4: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16,
    textAlign: 'left',
  })),
  Body1: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 24,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 36,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Body2: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 33,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Body3: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Body4: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 27,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Body5: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0.005,
    textAlign: 'left',
  })),
  Body6: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: 0.025,
    textAlign: 'left',
  })),
  Body7: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  })),
  Link1: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    textAlign: 'left',
  })),
  Button1: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.0015,
    textAlign: 'left',
  })),
  Button2: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 21,
    letterSpacing: 0.015,
    textAlign: 'left',
  })),
  Button3: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 16,
    letterSpacing: 0.04,
    textAlign: 'left',
  })),
  Caption1: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0.004,
    textAlign: 'left',
  })),
  Caption2: createTextComponent(() => ({
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 15,
    letterSpacing: 0.004,
    textAlign: 'left',
  })),
  Caption3: createTextComponent(() => ({
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 15,
    letterSpacing: 0.004,
    textAlign: 'left',
  })),
};

export default Typography;
