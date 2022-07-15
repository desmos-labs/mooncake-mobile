import DTextInput, {Props as DTextInputProps} from 'components/DTextInput';
import React, {useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {IconButton, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const DSecureTextInput: React.FC<DTextInputProps> = props => {
  const [focused, setFocused] = useState<boolean>();
  const {error} = props;
  const theme = useTheme();
  const styles = useStyles();
  const [hideText, setHideText] = useState(true);
  const iconColor = error
    ? theme.colors.pink01
    : focused && !error
    ? theme.colors.surfaceBlack
    : theme.colors.iconGrey;
  const textInputRef = useRef<TextInput>(null);

  return (
    <DTextInput
      {...props}
      inputRef={textInputRef}
      onFocus={() => setFocused(prev => !prev)}
      secureTextEntry={hideText}
      textAlignVertical="center"
      placeHolderColor={iconColor}
      style={[styles.input, focused && !error ? styles.focused : null]}
      rightElement={
        <IconButton
          icon={hideText ? 'eye' : 'eye-off'}
          color={iconColor}
          onPress={() => {
            setHideText(old => !old);
          }}
        />
      }
    />
  );
};

export default DSecureTextInput;
