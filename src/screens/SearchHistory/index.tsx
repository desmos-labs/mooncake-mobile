import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useOrderedSearchHistory, useStoreSearchHistory } from '@recoil/searchHistory';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import { Image } from 'expo-image';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import SearchItemComponent from 'screens/SearchHistory/components/SearchItem';
import { SearchItem } from 'types/searchHistory';
import useStyles from './useStyles';

/**
 * Component that renders the search view posts tab.
 * @constructor
 */
const SearchHistory = () => {
  const styles = useStyles();
  const searchHistory = useOrderedSearchHistory();
  const storeSearchHistory = useStoreSearchHistory();
  const { t } = useTranslation('search');

  const clearSearchHistory = useCallback(() => {
    storeSearchHistory([]);
  }, [storeSearchHistory]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<SearchItem>) => {
    return <SearchItemComponent searchItem={item} />;
  }, []);

  const EmptyHistoryComponent = useMemo(() => {
    return (
      <View style={styles.emptyRoot}>
        <Image source={emptyListPlaceholder} style={styles.emptyImage} />
        <Typography.Regular14>{t('nothing to show', { ns: 'search' })}</Typography.Regular14>
      </View>
    );
  }, [styles.emptyImage, styles.emptyRoot, t]);

  return searchHistory.length === 0 ? (
    EmptyHistoryComponent
  ) : (
    <View style={styles.root}>
      <View style={styles.topSection}>
        <Typography.Semibold16>{t('recent')}</Typography.Semibold16>
        <TouchableOpacity onPress={clearSearchHistory}>
          <Typography.Regular14>{t('clear all')}</Typography.Regular14>
        </TouchableOpacity>
      </View>
      <FlashList data={searchHistory} renderItem={renderItem} estimatedItemSize={65} />
    </View>
  );
};

export default SearchHistory;
