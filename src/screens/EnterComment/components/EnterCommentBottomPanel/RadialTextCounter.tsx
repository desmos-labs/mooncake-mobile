import React from 'react';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Typography from 'components/Typography';
import {useTheme} from 'react-native-paper';

type Props = {
  max: number;

  current: number;
};

const RadialTextCounter = ({max, current}: Props) => {
  const theme = useTheme();

  const progress = React.useMemo(() => {
    return (current / max) * 100;
  }, [current, max]);

  const remainingChars = React.useMemo(() => {
    return max - current;
  }, [current, max]);

  const showWarning = React.useMemo(
    () => remainingChars < 10,
    [remainingChars],
  );

  return (
    <AnimatedCircularProgress
      rotation={0}
      size={24}
      width={2}
      fill={progress}
      tintColor={showWarning ? theme.colors.pink01 : theme.colors.iconGrey}
      onAnimationComplete={() => console.log('onAnimationComplete')}
      backgroundColor={theme.colors.lightGrey01}>
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
