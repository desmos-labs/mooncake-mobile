import { usePostsListState } from '@recoil/screens/postsListState';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import CommonStyles from 'config/theme/CommonStyles';
import { Box, Center } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import SearchUsersResult from 'screens/SearchUsers/components/SearchUsersResult';
import { DesmosProfile } from 'types/desmos';
import useSearch from './hooks';
import useStyles from './useStyles';

/**
 * Component that renders the search view.
 * @constructor
 */
const SearchUsers = () => {
  const listState = usePostsListState();
  const styles = useStyles();
  const { t } = useTranslation('search');
  const { isSearching, profiles, getProfileForDTag, fetchMoreProfiles } = useSearch(
    listState.valueToSearch,
  );

  useEffect(() => {
    getProfileForDTag();
  }, [getProfileForDTag]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DesmosProfile>) => {
    return <SearchUsersResult profile={item} />;
  }, []);

  return (
    <Animated.View style={styles.view}>
      <View style={styles.wrapperView}>
        <KeyboardAvoidingView
          style={CommonStyles.flex['1']}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 180 : 0}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {isSearching ? (
            <Box flexGrow={1}>
              <Center flex={1}>
                <StyledSpinner />
              </Center>
            </Box>
          ) : (
            <FlashList
              keyboardDismissMode="on-drag"
              data={profiles}
              renderItem={renderItem}
              estimatedItemSize={55}
              ListEmptyComponent={
                listState.valueToSearch !== '' ? (
                  <>
                    <Spacer paddingTop={120} />
                    <EmptyListComponent label={t('no results')} />
                  </>
                ) : null
              }
              onEndReached={fetchMoreProfiles}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

export default SearchUsers;
