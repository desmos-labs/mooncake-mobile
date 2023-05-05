import { eyeClosed, eyeOpen } from 'assets/images';
import DTextInput, { Props as DTextInputProps } from 'components/DTextInput';
import React, { useState } from 'react';
import { Pressable, useTheme } from 'native-base';
import { Image } from 'react-native';
import useStyles from './useStyles';

const DSecureTextInput: React.FC<DTextInputProps> = ({ onOuterFocus, onOuterBlur, ...rest }) => {
  const [focused, setFocused] = useState<boolean>(false);
  // const {error} = props;
  const theme = useTheme();
  const styles = useStyles();
  const [hideText, setHideText] = useState(true);
  const iconColor = () => {
    if (focused && !rest.error) return theme.colors.surfaceBlack;
    if (rest.error) return theme.colors.pink01;
    return theme.colors.grey01;
  };

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
      onBlur={() => {
        setFocused(false);
        if (onOuterBlur) {
          onOuterBlur();
        }
      }}
      secureTextEntry={hideText}
      textAlignVertical="center"
      placeHolderColor={iconColor()}
      style={[styles.input, rest.style, rest.error && styles.error]}
      rightElement={
        <Pressable
          accessibilityLabel={`${a11yLabel}-${hideText ? 'hidden' : 'visible'}`}
          onPress={() => {
            setHideText(old => !old);
          }}>
          <Image
            style={[styles.icon, { tintColor: iconColor() }]}
            source={hideText ? eyeOpen : eyeClosed}
          />
        </Pressable>
      }
    />
  );
};

export default DSecureTextInput;
