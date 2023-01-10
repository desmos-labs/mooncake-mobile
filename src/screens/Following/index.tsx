import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import GetPaginatedFollowers from 'services/graphql/queries/GetPaginatedFollowers';
import GetPaginatedFollowing from 'services/graphql/queries/GetPaginatedFollowing';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import EmptyFollowers from './components/EmptyFollowers';
import EmptyFollowing from './components/EmptyFollowing';
import Error from './components/Error';
import ItemSeparator from './components/ItemSeparator';
import FollowingListItem from './components/FollowingListItem';
import Loading from './components/Loading/Loading';
import useHooks from './useHooks';
import useStyles from './useStyles';

type NavProps = CompositeScreenProps<
  MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.FOLLOWING>,
  StackScreenProps<RootNavigatorParamList>
>;

/**
 * @property {number} subspaceID - The ID of the subspace you want to get the following accounts for.
 * @property {string} userAddress - The address of the user you want to get the following accounts for.
 * @property {string} tabName - 'following' or 'followers'
 */
export type FollowingParams = {
  subspaceID: number;
  userAddress: string;
  headerTitle: string;
};

/**
 * It renders a FlatList of the user's following accounts
 * @param  - userAddress: The address of the user whose following accounts list we want to display.
 * @returns A list of users that the user is following accounts.
 */
export const Following: FC<NavProps> = ({route}) => {
  const {subspaceID, userAddress} = route.params;
  const styles = useStyles();
  const {t} = useTranslation('common');
  const {push} = useNavigation<NavProps['navigation']>();

  const isFollowing = route.name === (ROUTES.FOLLOWING as string);

  const {loading, error, data, fetchMore, refetch} = useHooks(
    subspaceID,
    userAddress,
    isFollowing ? GetPaginatedFollowing : GetPaginatedFollowers,
  );
  const [itemError, setItemError] = useState<string>('');
  const resetError = useCallback(() => setItemError(''), []);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<ProfileSummary>) => {
      return (
        <FollowingListItem
          {...item}
          onPress={() => {
            push(ROUTES.GUEST_PROFILE, {
              address: item.address,
            });
          }}
        />
      );
    },
    [subspaceID],
  );
  const Empty = useMemo(
    () => (isFollowing ? EmptyFollowing : EmptyFollowers),
    [isFollowing],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        refreshing={false}
        onRefresh={refetch}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={loading ? null : Empty}
        ListFooterComponent={loading ? Loading : undefined}
        onEndReachedThreshold={3}
        onEndReached={fetchMore}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        contentContainerStyle={styles.contentContainer}
      />
      {!!error && (
        <Error error={error.message} label={t('retry')} onPress={fetchMore} />
      )}
      {!!itemError && (
        <Error error={itemError} label={t('dismiss')} onPress={resetError} />
      )}
    </View>
  );
};

function keyExtractor(item: ProfileSummary) {
  return item.address;
}

const ITEM_HEIGHT = 60;
const ITEM_SEPARATOR_HEIGHT = 15;

function getItemLayout(_: unknown, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + ITEM_SEPARATOR_HEIGHT) * index,
    index,
  };
}

export default Following;
