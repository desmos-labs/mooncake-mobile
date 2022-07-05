import React, {MutableRefObject} from 'react';
import {StyleProp, TextInput, TextStyle, View, ViewStyle} from 'react-native';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

export type Props = Omit<React.ComponentProps<typeof TextInput>, 'style'> & {
  /**
   * If true highlight the input field to
   * signal to the user that the current value
   * is not valid.
   */
  error?: boolean;
  /**
   * Element to show on the right side of the
   * input area.
   */
  rightElement?: React.ReactNode | null;
  inputRef?: MutableRefObject<TextInput | null>;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

const DTextInput: React.FC<Props> = props => {
  const {rightElement, style, inputRef, inputStyle} = props;
  const styles = useStyles(props);
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <TextInput
        ref={inputRef}
        {...props}
        style={[styles.input, inputStyle]}
        placeholderTextColor={theme.colors.font['3']}
      />
      <View style={styles.right}>{rightElement}</View>
    </View>
  );
};

export default DTextInput;
