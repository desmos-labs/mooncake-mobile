import { magnifyingGlass } from 'assets/images';
import React from 'react';
import { Image, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  handleChange: (text: string) => void;
  searchPlaceHolder: string;
};

const SearchBar = ({ handleChange, searchPlaceHolder }: Props) => {
  const styles = useStyles();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image style={styles.magnifyingGlass} source={magnifyingGlass} />
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        placeholderTextColor={theme.colors.grey02}
        placeholder={searchPlaceHolder}
      />
    </View>
  );
};

export default SearchBar;
