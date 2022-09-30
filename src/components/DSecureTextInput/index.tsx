import {eyeClosed, eyeOpen} from 'assets/images';
import DTextInput, {Props as DTextInputProps} from 'components/DTextInput';
import React, {useState} from 'react';
import {IconButton, useTheme} from 'react-native-paper';
import useStyles from './useStyles';

const DSecureTextInput: React.FC<DTextInputProps> = ({
  onOuterFocus,
  ...rest
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  // const {error} = props;
  const theme = useTheme();
  const styles = useStyles();
  const [hideText, setHideText] = useState(true);
  const iconColor = focused ? theme.colors.surfaceBlack : theme.colors.iconGrey;

  const a11yLabel = rest.accessibilityLabel;

  return (
    <DTextInput
      {...rest}
      onFocus={() => {
        setFocused(true);
        if (onOuterFocus) {
          onOuterFocus();
        }
      }}
      onBlur={() => setFocused(false)}
      secureTextEntry={hideText}
      textAlignVertical="center"
      placeHolderColor={iconColor}
      style={[
        styles.input,
        rest.style,
        // error && styles.error, focused && styles.focused
      ]}
      rightElement={
        <IconButton
          accessibilityLabel={`${a11yLabel}-${hideText ? 'hidden' : 'visible'}`}
          icon={hideText ? eyeOpen : eyeClosed}
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
