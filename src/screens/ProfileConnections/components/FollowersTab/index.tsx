import React, { useEffect } from 'react';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import useFollowers from 'hooks/relationships/useFollowers';
import UsersList from '../UsersList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWERS>;

/**
 * Tab that displays the followers of a given account.
 * @constructor
 */
const FollowersTab = () => {
  const { t } = useTranslation('followersAndFollowing');

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    followers,
    loading,
    fetchMore,
    fetchingMore,
    refetch: refreshFollowers,
    refreshing,
  } = useFollowers(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    // Refresh the followers list when the user views the screen
    refreshFollowers();

    // It's okay to disable the exhaustive-deps rule here because we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <UsersList
      userAddress={userAddress}
      users={followers}
      loading={loading}
      fetchMore={fetchMore}
      fetchingMore={fetchingMore}
      refresh={refreshFollowers}
      refreshing={refreshing}
      emptyText={t('noFollowers')}
    />
  );
};

export default FollowersTab;
