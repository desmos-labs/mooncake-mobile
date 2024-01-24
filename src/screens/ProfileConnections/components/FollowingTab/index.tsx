import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import StyledSpinner from 'components/StyledSpinner';
import useFollowing from 'hooks/relationships/useFollowing';
import sleep from 'lib/sleep';
import { Center } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useEffect, useState } from 'react';
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
  const [firstFocus, setFirstFocus] = useState(true);

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    data: following,
    loading,
    initialLoading: isFirstLoading,
    fetchMore,
    refresh: refreshFollowing,
    refreshing,
  } = useFollowing(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshFollowing().then(() => sleep(500).then(() => setFirstFocus(false)));
  }, [refreshFollowing]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (firstFocus) {
    return (
      <Center flex={1} flexGrow={1} backgroundColor="white">
        <StyledSpinner />
      </Center>
    );
  }

  return (
    <UsersList
      users={following}
      loading={loading}
      fetchMore={fetchMore}
      fetchingMore={loading && !isFirstLoading}
      refresh={refreshFollowing}
      refreshing={refreshing}
      emptyText={t('noFollowers')}
    />
  );
};

export default FollowingTab;
