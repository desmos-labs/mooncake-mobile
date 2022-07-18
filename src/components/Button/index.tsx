import MaterialButton from 'components/MaterialButton';
import React, {ReactNode} from 'react';
import {
  Platform,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {IconSource} from 'react-native-paper/lib/typescript/components/Icon';

export type Props = {
  /**
   * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
   * - `text` - flat button without background or outline (low emphasis)
   * - `outlined` - button with an outline (medium emphasis)
   * - `contained` - button with a background color and elevation shadow (high emphasis)
   */
  mode?: 'text' | 'outlined' | 'contained' | 'gradient' | 'gradientFilled';
  /**
   * Custom text color for flat button,
   * or background color for contained button.
   */
  color?: string;
  /**
   * Icon to display for the `Button`.
   */
  icon?: IconSource;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Style for the button text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Whether the button is disabled.
   * A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * If tru display the button with the accent color from the current1 theme.
   */
  accent?: boolean;
  /**
   * Modify the container wrapping the children prop. Has no effect for text mode.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * Modify the container wrapping the gradient button. Has no effect for other modes.
   */
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

const Button: React.FC<Props> = ({onPress, ...props}: Props) => {
  return Platform.OS === 'ios' ? (
    <TouchableOpacity onPress={onPress}>
      <MaterialButton {...props}>{props.children}</MaterialButton>
    </TouchableOpacity>
  ) : (
    <MaterialButton onPress={onPress} {...props} />
  );
};

export default Button;
