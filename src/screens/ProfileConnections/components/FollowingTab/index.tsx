import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import useFollowing from 'hooks/relationships/useFollowing';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import UsersList from 'screens/ProfileConnections/components/UsersList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWING>;

/**
 * Tab that displays the list of profiles that the given account is following.
 * @constructor
 */
const FollowingTab = () => {
  const { t } = useTranslation('relationships');
  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { items, loading, fetchMore, refresh, refreshing, fetchingMore } =
    useFollowing(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <UsersList
      users={items}
      loading={loading}
      fetchMore={fetchMore}
      fetchingMore={fetchingMore}
      refresh={refresh}
      refreshing={refreshing}
      emptyText={t('noFollowers')}
    />
  );
};

export default FollowingTab;
