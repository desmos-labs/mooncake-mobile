import {eyeClosed} from 'assets/images';
import DTextInput, {Props as DTextInputProps} from 'components/DTextInput';
import React, {useState} from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const DSecureTextInput: React.FC<DTextInputProps> = props => {
  const [focused, setFocused] = useState<boolean>(false);
  const {error} = props;
  const theme = useTheme();
  const styles = useStyles();
  const [hideText, setHideText] = useState(true);
  const iconColor = error
    ? theme.colors.pink01
    : focused && !error
    ? theme.colors.surfaceBlack
    : theme.colors.iconGrey;

  return (
    <DTextInput
      {...props}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      secureTextEntry={hideText}
      textAlignVertical="center"
      placeHolderColor={iconColor}
      style={[styles.input, error && styles.error, focused && styles.focused]}
      rightElement={
        <IconButton
          style={styles.eyeIcon}
          icon={hideText ? 'eye' : eyeClosed}
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
