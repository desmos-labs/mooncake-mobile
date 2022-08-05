import React from 'react';
import {Image, TextInput, View} from 'react-native';
import {magnifyingGlass} from 'assets/images';
import {useTranslation} from 'react-i18next';
import {useTheme} from 'react-native-paper';
import useStyles from './useStyles';

type Props = {
  handleChange: (text: string) => void;
};

const SearchBar = ({handleChange}: Props) => {
  const styles = useStyles();

  const {t} = useTranslation('selectChain');

  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image style={styles.magnifyingGlass} source={magnifyingGlass} />
      <TextInput
        onChangeText={handleChange}
        placeholderTextColor={theme.colors.grey02}
        placeholder={t('searchPlaceholder')}
      />
    </View>
  );
};

export default SearchBar;
