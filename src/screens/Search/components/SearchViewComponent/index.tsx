import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import Typography from 'components/Typography';
import CommonStyles from 'config/theme/CommonStyles';
import { Box, Center } from 'native-base';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated from 'react-native-reanimated';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import SearchResultComponent from 'screens/Search/components/SearchResultComponent';
import { DesmosProfile } from 'types/desmos';
import useSearch from './hooks';
import useStyles from './useStyles';

interface Props {
  valueToSearch: string;
}

/**
 * Component that renders the search view.
 * @param valueToSearch The value used inside the search bar
 * @constructor
 */
const SearchViewComponent = ({ valueToSearch }: Props) => {
  const styles = useStyles();
  const { t } = useTranslation('search');
  const { isSearching, profiles, getProfileForDTag, fetchMoreProfiles } = useSearch(valueToSearch);

  useEffect(() => {
    getProfileForDTag();
  }, [getProfileForDTag]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DesmosProfile>) => {
    return <SearchResultComponent profile={item} />;
  }, []);

  return (
    <Animated.View style={styles.absoluteView}>
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
            <>
              {profiles.length !== 0 && (
                <Box marginBottom="m">
                  <Typography.Body6>
                    {t('total results', { number: profiles.length })}
                  </Typography.Body6>
                </Box>
              )}
              <FlashList
                keyboardDismissMode="on-drag"
                data={profiles}
                renderItem={renderItem}
                estimatedItemSize={55}
                ListEmptyComponent={
                  valueToSearch !== '' ? (
                    <>
                      <Spacer paddingTop={120} />
                      <EmptyListComponent label={t('no results')} />
                    </>
                  ) : null
                }
                onEndReached={fetchMoreProfiles}
              />
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

export default SearchViewComponent;
