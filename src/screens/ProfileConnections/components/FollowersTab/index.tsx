import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import useFollowers from 'hooks/relationships/useFollowers';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UsersList from '../UsersList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWERS>;

/**
 * Tab that displays the followers of a given account.
 * @constructor
 */
const FollowersTab = () => {
  const { t } = useTranslation('relationships');
  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const { items, loading, refreshing, refresh, fetchMore, fetchingMore } =
    useFollowers(userAddress);

  useEffect(() => {
    console.log('FollowersTab: useEffect', loading, items.length);
  }, [items.length, loading]);

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

export default FollowersTab;
