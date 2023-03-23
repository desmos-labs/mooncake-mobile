import React, { memo } from 'react';
import { Button as NBButton } from 'native-base';
import { useMakeButtonStyle, useMakeButtonTypography } from 'components/CustomButton/hooks';
import { ColorType } from 'native-base/lib/typescript/components/types';

interface Props
  extends Omit<
    React.ComponentProps<typeof NBButton>,
    'shadow' | '_pressed' | 'hover' | 'opacity' | 'color' | 'colorScheme' | '_text'
  > {
  /**
   * The relative height of the button.
   */
  size?: 26 | 32 | 44 | 56;

  /**
   * The text that will be rendered on the button.
   */
  children?: string;

  /**
   * Optionally override the default button text color.
   */
  textColor?: ColorType;

  /**
   * Change the background color of the button.
   */
  backgroundColor?: ColorType;

  /**
   * Change the outline/border color of the button. Only relevant for outlined variant.
   */
  borderColor?: ColorType;

  /**
   * What to do when the button is pressed.
   */
  onPress?: () => void;
}

/**
 * A button component based on the native-base Button.
 * @constructor
 */
const CustomButton = ({
  size = 56,
  variant = 'solid',
  backgroundColor,
  borderColor,
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
      {...makeButtonStyle({ variant, backgroundColor, borderColor })}
      py={size / 3}
      isDisabled={rest.disabled || rest.isDisabled}
      _disabled={{
        backgroundColor: 'tabIconGrey',
      }}
      {...rest}>
      {children}
    </NBButton>
  );
};

export default memo(CustomButton);
