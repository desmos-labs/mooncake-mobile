import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Typography from 'components/Typography';
import React, { useCallback, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SearchResultComponent from 'screens/Home/components/SearchResultComponent';
import { DesmosProfile } from 'types/desmos';
import { Box, Center } from 'native-base';
import StyledSpinner from 'components/StyledSpinner';
import { useTranslation } from 'react-i18next';
import CommonStyles from 'config/theme/CommonStyles';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import useStyles from './useStyles';
import useHooks from './hooks';

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
  const { isSearching, profiles, getProfileForDTag, fetchMoreProfiles } = useHooks(valueToSearch);

  useEffect(() => {
    getProfileForDTag();
  }, [getProfileForDTag]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DesmosProfile>) => {
    return <SearchResultComponent profile={item} />;
  }, []);

  return (
    <Animated.View style={styles.absoluteView} entering={FadeInDown}>
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
                ListEmptyComponent={<EmptyListComponent label={t('no results')} />}
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
