import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {FC, useCallback} from 'react';
import {FlatList, ListRenderItemInfo, View} from 'react-native';
import {QueueData} from 'services/graphql/queries/GetPaginatedFollowers';
import useHooks from './useHooks';
import Empty from './components/Empty';
import useStyles from './useStyles';
import ItemSeparator from './components/ItemSeparator';
import Loading from './components/Loading/Loading';
import Error from './components/Error';
import ListItem from './components/ListItem';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.FOLLOWERS
>;

/**
 * @property {number} subspaceID - The ID of the subspace you want to get the followers for.
 * @property {string} userAddress - The address of the user you want to get the followers for.
 * @property {string} username - The username of the user you want to get the followers for.
 */
export type FollowersParams = {
  subspaceID: number;
  userAddress: string;
  username: string;
};

/**
 * It renders a FlatList of the user's followers
 * @param  - userAddress: The address of the user whose followers list we want to display.
 * @returns A list of users that the user is followers.
 */
export const FollowersTab: FC<NavProps> = ({route}) => {
  const {subspaceID, userAddress} = route.params;
  const styles = useStyles();

  const {loading, error, data, fetchMore, refetch} = useHooks(
    subspaceID,
    userAddress,
  );

  const renderItem = useCallback(
    (props: ListRenderItemInfo<QueueData['paginatedFollowers'][number]>) => {
      return <ListItem {...props} />;
    },
    [subspaceID, userAddress],
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
        onEndReachedThreshold={0.5}
        onEndReached={fetchMore}
        getItemLayout={getItemLayout}
      />
      {!!error && <Error error={error} onPress={fetchMore} />}
    </View>
  );
};

const ITEM_HEIGHT = 80;

function getItemLayout(_: unknown, index: number) {
  return {
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  };
}

export default FollowersTab;
