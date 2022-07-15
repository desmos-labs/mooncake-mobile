import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import {addAlphaToHex} from 'config/theme';

type Props = {
  colors?: string[];
  height?: number;
};

const GradientBorder = ({colors, height = 50}: Props) => {
  const theme = useTheme();
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={
        colors || [
          theme.colors.background,
          addAlphaToHex(theme.colors.background, 0.2),
        ]
      }
      style={{height, width: '100%'}}
    />
  );
};

export default GradientBorder;
