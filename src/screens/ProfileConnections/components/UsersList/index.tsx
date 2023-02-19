import React, { ReactNode, useCallback, useMemo } from 'react';
import { FlatList, Image, ListRenderItemInfo, View } from 'react-native';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import { DesmosProfile } from 'types/desmos';
import { errorImage } from 'assets/images';
import Typography from 'components/Typography';
import ItemSeparator from '../../../UsersList/components/ItemSeparator';
import UserListItem from '../UserListItem';
import useStyles from './useStyles';
import Loading from '../Loading';

export interface UsersListProps {
  /**
   * Address of the user for which the list is being rendered.
   */
  readonly userAddress: string;
  /**
   * The list of users to render.
   */
  readonly users: DesmosProfile[];
  /**
   * Whether the list is loading or not.
   */
  readonly loading: boolean;
  /**
   * Function to call to fetch more users.
   */
  readonly fetchMore: () => void;
  /**
   * Whether the list is fetching more users or not.
   */
  readonly fetchingMore: boolean;
  /**
   * Function to call to refresh the list.
   */
  readonly refresh: () => void;
  /**
   * Whether the list is refreshing or not.
   */
  readonly refreshing: boolean;
  /**
   * The text to show when the list is empty.
   * // - For followers: t('followersAndFollowing:noFollowers')
   * // - For following: t('followersAndFollowing:noFollowingDTags')
   */
  readonly emptyText: string | ReactNode;
}

// Layout parameters
const ITEM_HEIGHT = 60;
const ITEM_SEPARATOR_HEIGHT = 15;

/**
 * Component that renders a list of users.
 * @constructor
 */
export const UsersList = (props: UsersListProps) => {
  const styles = useStyles();

  const { userAddress, users, loading, fetchMore, fetchingMore, refresh, refreshing, emptyText } =
    props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Callback used to get the key of each item
  const keyExtractor = useCallback((item: DesmosProfile) => {
    return item.address;
  }, []);

  // Callback used to get the item layout
  const getItemLayout = useCallback((_: unknown, index: number) => {
    return {
      length: ITEM_HEIGHT,
      offset: (ITEM_HEIGHT + ITEM_SEPARATOR_HEIGHT) * index,
      index,
    };
  }, []);

  // Callback used to render each item within the list
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DesmosProfile>) => {
      return <UserListItem profileAddress={userAddress} user={item} onPress={navigateToProfile} />;
    },
    [navigateToProfile, userAddress],
  );

  // Component used to render an empty list
  const EmptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyListView}>
        <Image style={styles.emptyListImage} source={errorImage} />
        <Typography.Subtitle1 style={styles.emptyListText}>{emptyText}</Typography.Subtitle1>
      </View>
    );
  }, [emptyText, styles.emptyListImage, styles.emptyListText, styles.emptyListView]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        refreshing={false}
        onRefresh={refresh}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
        ListEmptyComponent={loading ? null : EmptyComponent}
        ListFooterComponent={loading ? Loading : undefined}
        onEndReachedThreshold={3}
        onEndReached={fetchMore}
        getItemLayout={getItemLayout}
        keyExtractor={keyExtractor}
        removeClippedSubviews={true}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default UsersList;
