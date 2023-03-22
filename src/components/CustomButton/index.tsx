import React, { memo } from 'react';
import { Button as NBButton } from 'native-base';
import { ColorValue } from 'react-native';
import { useMakeButtonStyle, useMakeButtonTypography } from 'components/CustomButton/hooks';

interface Props
  extends Omit<
    React.ComponentProps<typeof NBButton>,
    'shadow' | '_pressed' | 'hover' | 'opacity' | 'color' | 'colorScheme' | '_text'
  > {
  size?: 26 | 32 | 44 | 56;

  children?: string;

  textColor?: ColorValue;

  buttonColor?: string;

  onPress?: () => void;
}

const CustomButton = ({
  size = 56,
  variant = 'solid',
  buttonColor,
  textColor,
  children,
  ...rest
}: Props) => {
  const makeButtonStyle = useMakeButtonStyle();

  const makeButtonTypography = useMakeButtonTypography();

  return (
    <NBButton
      {...makeButtonTypography({ size, textColor })}
      // can ignore this error as variant has a default value of solid
      // @ts-ignore
      {...makeButtonStyle({ variant, buttonColor })}
      py={size / 3}
      {...rest}>
      {children}
    </NBButton>
  );
};

export default memo(CustomButton);
