import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import UsersList from 'screens/ProfileConnections/components/UsersList';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useFollowing from 'hooks/relationships/useFollowing';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWING>;

/**
 * Tab that displays the list of profiles that the given account is following.
 * @constructor
 */
const FollowingTab = () => {
  const { t } = useTranslation('followersAndFollowing');

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    following,
    loading,
    fetchMore,
    fetchingMore,
    refetch: refreshFollowing,
    refreshing,
  } = useFollowing(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    // Refresh the following list when the user views the screen
    refreshFollowing();

    // It's okay to disable the exhaustive-deps rule here because we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <UsersList
      users={following}
      loading={loading}
      fetchMore={fetchMore}
      fetchingMore={fetchingMore}
      refresh={refreshFollowing}
      refreshing={refreshing}
      emptyText={t('noFollowers')}
    />
  );
};

export default FollowingTab;
