import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useStoreSearchHistory } from '@recoil/searchHistory';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { SearchItem } from 'types/searchHistory';
import useStyles from './useStyles';

interface Props {
  searchItem: SearchItem;
}

const SearchItemComponent = ({ searchItem }: Props) => {
  const styles = useStyles();
  const storeHistory = useStoreSearchHistory();
  const theme = useTheme();

  const removeSearchItem = useCallback(() => {
    storeHistory(prev => prev.filter(item => item.id !== searchItem.id));
  }, [searchItem.id, storeHistory]);

  return (
    <View style={styles.root}>
      <View style={styles.leftItems}>
        <MaterialCommunityIcons
          name="clock-time-four-outline"
          size={24}
          color={theme.colors.neutralVariants['700']}
        />
        <Typography.Regular16 style={{ color: theme.colors.neutralVariants['700'] }}>
          {searchItem.value}
        </Typography.Regular16>
      </View>
      <TouchableOpacity onPress={removeSearchItem}>
        <AntDesign name="close" size={24} color={theme.colors.neutralVariants['700']} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchItemComponent;
