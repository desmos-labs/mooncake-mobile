import { magnifyingGlass } from 'assets/images';
import React, { useEffect, useRef } from 'react';
import { TextInput, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
import useStyles from './useStyles';

type Props = {
  handleChange: (text: string) => void;
  searchPlaceHolder: string;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
};

const HomeSearchBar = ({ handleChange, searchPlaceHolder, onFocus, onBlur, focused }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (focused) {
      textInputRef.current?.focus();
    } else {
      textInputRef.current?.clear();
      textInputRef.current?.blur();
    }
  }, [focused, textInputRef]);

  return (
    <View style={styles.container}>
      <FastImage style={styles.magnifyingGlass} source={magnifyingGlass} />
      <TextInput
        textAlign="left"
        autoCorrect={true}
        disableFullscreenUI={true}
        allowFontScaling={true}
        numberOfLines={1}
        ref={textInputRef}
        style={styles.input}
        onChangeText={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholderTextColor={theme.colors.grey01}
        placeholder={searchPlaceHolder}
      />
    </View>
  );
};

export default HomeSearchBar;
