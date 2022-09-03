import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback, useState} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {QueueData} from 'services/graphql/queries/GetPaginatedFollowing';
import {useTranslation} from 'react-i18next';
import useHooks from './useHooks';
import Empty from './components/Empty';
import useStyles from './useStyles';
import ItemSeparator from './components/ItemSeparator';
import Loading from './components/Loading/Loading';
import Error from './components/Error';
import ListItem from './components/ListItem';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWING
>;

/**
 * @property {number} subspaceID - The ID of the subspace you want to get the following accounts for.
 * @property {string} userAddress - The address of the user you want to get the following accounts for.
 * @property {string} username - The username of the user you want to get the following accounts for.
 */
export type FollowingParams = {
  subspaceID: number;
  userAddress: string;
  username: string;
};

/**
 * It renders a FlatList of the user's following accounts
 * @param  - userAddress: The address of the user whose following accounts list we want to display.
 * @returns A list of users that the user is following accounts.
 */
export const FollowingTab: FC<NavProps> = ({route}) => {
  const {subspaceID, userAddress} = route.params;
  const styles = useStyles();
  const {t} = useTranslation('common');
  const {loading, error, data, fetchMore, refetch} = useHooks(
    subspaceID,
    userAddress,
  );
  const [itemError, setItemError] = useState<string>('');
  const resetError = useCallback(() => setItemError(''), []);

  const renderItem = useCallback(
    (props: ListRenderItemInfo<QueueData['paginatedFollowers'][number]>) => {
      return (
        <ListItem
          {...props}
          subspaceID={subspaceID}
          handleError={setItemError}
        />
      );
    },
    [subspaceID],
  );

  return (
    <View style={styles.contentContainer}>
      <FlatList
        data={data?.paginatedFollowers}
        style={styles.flatList}
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

function keyExtractor(item: PaginatedFollower) {
  return item._.address;
}

const ITEM_HEIGHT = 60;
const ITEM_SEPARATOR_HEIGHT = 21;

function getItemLayout(_: unknown, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: (ITEM_HEIGHT + ITEM_SEPARATOR_HEIGHT) * index,
    index,
  };
}
