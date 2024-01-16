import { useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { usePostsListState } from '@recoil/screens/postsListState';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import PostCard from 'components/PostCard';
import Spacer from 'components/Spacer';
import CommonStyles from 'config/theme/CommonStyles';
import { usePaginatedData } from 'hooks/usePaginatedData';
import { SearchTabsParamList } from 'navigation/RootNavigator/SearchTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import { useSearchPosts } from 'screens/SearchPosts/hooks';
import { Post } from 'types/posts';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<SearchTabsParamList, ROUTES.SEARCH_TAB_POSTS>;

/**
 * Component that renders the search view.
 * @constructor
 */
const SearchPostsTab = () => {
  const { params } = useRoute<NavProps['route']>();
  const listState = usePostsListState();
  const styles = useStyles();
  const { t } = useTranslation('search');
  const searchPost = useSearchPosts();

  const { data, loading, refreshing, filter, fetchMore, updateFilter } = usePaginatedData(
    searchPost,
    {
      itemsPerPage: 20,
      updateFilterDebounceTimeMs: 500,
      initialFilter: {
        value: '',
      },
      extraDelay: 250,
    },
  );

  useEffect(() => {
    const callback = (value: string) => {
      updateFilter(currentFilter => ({
        ...currentFilter,
        value,
      }));
    };
    params.eventEmitter.addListener('valueChange', callback);
    return () => {
      params.eventEmitter.removeListener('valueChange', callback);
    };
  }, [params.eventEmitter]);

  const renderEmptyComponent = useCallback(() => {
    return filter?.value !== '' && !refreshing && !loading ? (
      <>
        <Spacer paddingTop={120} />
        <EmptyListComponent label={t('no results')} />
      </>
    ) : null;
  }, [refreshing, loading, listState.valueToSearch]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Post>) => {
    return <PostCard post={item} />;
  }, []);

  return (
    <Animated.View style={styles.view}>
      <View style={styles.wrapperView}>
        <KeyboardAvoidingView
          style={CommonStyles.flex['1']}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <FlashList
            keyboardDismissMode="on-drag"
            data={data}
            renderItem={renderItem}
            estimatedItemSize={200}
            ListEmptyComponent={renderEmptyComponent}
            onEndReached={fetchMore}
          />
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

export default SearchPostsTab;
