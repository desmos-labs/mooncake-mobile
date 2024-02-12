import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

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
   * @default theme.colors.neutralVariants['600']
   */
  customEmptyColor?: string;

  /**
   * Override default warn color.
   * @default theme.colors.feedback.error
   */
  customWarnColor?: string;

  /**
   * The size of the progress bar.
   * Defaults to 24.
   */
  size?: number;
};

const RadialTextCounter = ({
  max,
  current,
  customFillColor,
  customEmptyColor,
  customWarnColor,
  size = 24,
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
    return customFillColor || theme.colors.neutralVariants['400'];
  }, [customFillColor, theme.colors.neutralVariants]);

  const emptyColor = React.useMemo(() => {
    return customEmptyColor || theme.colors.neutralVariants['400'];
  }, [customEmptyColor, theme.colors.neutralVariants]);

  const warnColor = React.useMemo(() => {
    return customWarnColor || theme.colors.feedback.error;
  }, [customWarnColor, theme.colors.feedback.error]);

  return (
    <AnimatedCircularProgress
      rotation={0}
      size={size + 2}
      width={2}
      padding={2}
      fill={progress}
      tintColor={showWarning ? warnColor : fillColor}
      backgroundColor={emptyColor}>
      {() => {
        return (
          <Typography.Semibold12
            style={{
              color: showWarning
                ? theme.colors.feedback.error
                : theme.colors.neutralVariants['400'],
            }}>
            {remainingChars < 10 ? remainingChars : ''}
          </Typography.Semibold12>
        );
      }}
    </AnimatedCircularProgress>
  );
};

export default RadialTextCounter;
