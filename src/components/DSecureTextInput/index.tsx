import DTextInput, {Props as DTextInputProps} from 'components/DTextInput';
import React, {useState} from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const DSecureTextInput: React.FC<DTextInputProps> = props => {
  const [focused, setFocused] = useState(false);
  const {error} = props;
  const theme = useTheme();
  const styles = useStyles();
  const [hideText, setHideText] = useState(true);

  return (
    <DTextInput
      {...props}
      onFocus={() => setFocused(!focused)}
      secureTextEntry={hideText}
      textAlignVertical="center"
      style={focused && !error ? styles.focused : null}
      rightElement={
        <IconButton
          icon={hideText ? 'eye' : 'eye-off'}
          color={
            error
              ? 'rgba(243, 89, 168, 1)'
              : focused && !error
              ? '#25282D'
              : theme.colors.iconGrey
          }
          onPress={() => {
            setHideText(old => !old);
          }}
        />
      }
    />
  );
};

export default DSecureTextInput;
