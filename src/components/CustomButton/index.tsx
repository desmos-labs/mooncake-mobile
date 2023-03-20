import React, { memo } from 'react';
import { Button as NBButton } from 'native-base';
import { ColorValue } from 'react-native';
import { useMakeButtonTextComponent, useMakeButtonProps } from 'components/CustomButton/hooks';

interface Props
  extends Omit<
    React.ComponentProps<typeof NBButton>,
    'shadow' | 'variant' | '_pressed' | 'hover' | 'opacity'
  > {
  size?: 26 | 32 | 44 | 56;

  mode?: 'contained' | 'text' | 'outlined';

  children: string;

  textColor?: ColorValue;

  buttonColor?: string;
}

const CustomButton = ({
  size = 56,
  mode = 'contained',
  buttonColor,
  textColor,
  children,
  ...rest
}: Props) => {
  const makeButtonProps = useMakeButtonProps();

  const buildTextComponent = useMakeButtonTextComponent();

  return (
    <NBButton {...makeButtonProps({ mode, buttonColor })} {...rest} py={size / 3}>
      {buildTextComponent({ size, textColor, children })}
    </NBButton>
  );
};

export default memo(CustomButton);
