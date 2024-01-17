import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useTheme } from 'native-base';

type Props = {
  /**
   * The maximum value used to calculate progress
   */
  max: number;

  /**
   * The current length of the string that the progress will be calculated for
   */
  current: number;

  /**
   * Override default filled color.
   * @default theme.colors.iconGrey
   */
  customFillColor?: string;

  /**
   * Override default empty color.
   * @default theme.colors.lightGrey01
   */
  customEmptyColor?: string;

  /**
   * Override default warn color.
   * @default theme.colors.pink01
   */
  customWarnColor?: string;
};

const RadialTextCounter = ({
  max,
  current,
  customFillColor,
  customEmptyColor,
  customWarnColor,
}: Props) => {
  const theme = useTheme();

  const progress = React.useMemo(() => {
    return (current / max) * 100;
  }, [current, max]);

  const remainingChars = React.useMemo(() => {
    return max - current;
  }, [current, max]);

  const showWarning = React.useMemo(() => remainingChars < 10, [remainingChars]);

  const fillColor = React.useMemo(() => {
    return customFillColor || theme.colors.iconGrey;
  }, [customFillColor, theme.colors.iconGrey]);

  const emptyColor = React.useMemo(() => {
    return customEmptyColor || theme.colors.lightGrey01;
  }, [customEmptyColor, theme.colors.lightGrey01]);

  const warnColor = React.useMemo(() => {
    return customWarnColor || theme.colors.pink01;
  }, [customWarnColor, theme.colors.pink01]);

  return (
    <AnimatedCircularProgress
      rotation={0}
      size={24}
      width={2}
      fill={progress}
      tintColor={showWarning ? warnColor : fillColor}
      backgroundColor={emptyColor}>
      {() => {
        return (
          <Typography.Subtitle4
            style={{
              color: showWarning ? theme.colors.pink01 : theme.colors.iconGrey,
            }}>
            {remainingChars < 10 ? remainingChars : ''}
          </Typography.Subtitle4>
        );
      }}
    </AnimatedCircularProgress>
  );
};

export default RadialTextCounter;
