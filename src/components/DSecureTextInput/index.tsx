import DTextInput, {Props as DTextInputProps} from 'components/DTextInput';
import React, {useState} from 'react';
import {IconButton, useTheme} from 'react-native-paper';

const DSecureTextInput: React.FC<DTextInputProps> = props => {
  const theme = useTheme();
  const [hideText, setHideText] = useState(true);

  return (
    <DTextInput
      {...props}
      secureTextEntry={hideText}
      textAlignVertical="center"
      rightElement={
        <IconButton
          icon={hideText ? 'eye' : 'eye-off'}
          color={theme.colors.icon['3']}
          onPress={() => {
            setHideText(old => !old);
          }}
        />
      }
    />
  );
};

export default DSecureTextInput;
