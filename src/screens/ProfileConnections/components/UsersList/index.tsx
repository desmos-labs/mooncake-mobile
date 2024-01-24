import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FlashList, ListRenderItemInfo } from '@shopify/flash-list';
import { emptyListPlaceholder } from 'assets/images';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import React, { ReactNode, useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';
import { DesmosProfile } from 'types/desmos';
import Loading from '../Loading';
import UserListItem from '../UserListItem';
import useStyles from './useStyles';

interface UsersListProps {
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
   */
  readonly emptyText: string | ReactNode;
}

// Layout parameters
const ITEM_HEIGHT = 60;

/**
 * Component that renders a list of users.
 * @constructor
 */
const UsersList = (props: UsersListProps) => {
  const styles = useStyles();

  const { users, loading, fetchMore, fetchingMore, refresh, refreshing, emptyText } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const navigateToProfile = useNavigateToProfile();

  // Callback used to render each item within the list
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DesmosProfile>) => {
      return (
        <UserListItem
          profileAddress={item.address}
          user={item}
          onPress={() => navigateToProfile(item.address)}
        />
      );
    },
    [navigateToProfile],
  );

  // Component used to render an empty list
  const EmptyComponent = useMemo(() => {
    return (
      <View style={styles.emptyListView}>
        <Image style={styles.emptyListImage} source={emptyListPlaceholder} />
        <Typography.Regular16 style={styles.emptyListText}>{emptyText}</Typography.Regular16>
      </View>
    );
  }, [emptyText, styles.emptyListImage, styles.emptyListText, styles.emptyListView]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <FlashList
        data={users}
        refreshing={refreshing}
        onRefresh={refresh}
        renderItem={renderItem}
        ListEmptyComponent={loading ? null : EmptyComponent}
        ListFooterComponent={fetchingMore ? Loading : undefined}
        onEndReached={fetchMore}
        keyExtractor={item => item.address}
        estimatedItemSize={ITEM_HEIGHT}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

export default UsersList;
