import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import Typography from 'components/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import SearchResultComponent from 'screens/Home/components/SearchResultComponent';
import useCustomLazyQuery from 'hooks/graphql/useCustomLazyQuery';
import GetProfileForDTag from 'services/graphql/queries/GetProfileForDTag';
import { DesmosProfile } from 'types/desmos';
import { convertGraphQLProfile } from 'lib/GraphQLUtils';
import { Box, Center } from 'native-base';
import StyledSpinner from 'components/StyledSpinner';
import sleep from 'lib/sleep';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

interface Props {
  valueToSearch: string;
}

const SearchViewComponent = ({ valueToSearch }: Props) => {
  const styles = useStyles();
  const getProfile = useCustomLazyQuery(GetProfileForDTag);
  const { t } = useTranslation('search');
  const [profiles, setProfiles] = useState<DesmosProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const getProfileForDTag = useCallback(async () => {
    setIsSearching(true);
    let results;
    if (valueToSearch !== '') {
      results = await getProfile({
        variables: {
          dTag: `%${valueToSearch}%`,
        },
      });
    } else {
      results = await getProfile({
        variables: {
          dTag: '',
        },
      });
    }
    const convertedProfiles = results.profile.map((profile: any) => convertGraphQLProfile(profile));
    setProfiles(convertedProfiles);
    await sleep(500);
    setIsSearching(false);
  }, [getProfile, valueToSearch]);

  useEffect(() => {
    getProfileForDTag();
  }, [getProfileForDTag]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<DesmosProfile>) => {
    return <SearchResultComponent profile={item} />;
  }, []);

  return (
    <Animated.View style={styles.absoluteView} entering={FadeInDown}>
      <View style={{ height: '100%', width: '100%' }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
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
                estimatedItemSize={150}
                ListEmptyComponent={
                  <View style={{ alignItems: 'center', paddingTop: 200 }}>
                    <Typography.Body6>No results</Typography.Body6>
                  </View>
                }
              />
            </>
          )}
        </KeyboardAvoidingView>
      </View>
    </Animated.View>
  );
};

export default SearchViewComponent;
