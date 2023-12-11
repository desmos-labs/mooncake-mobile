import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import UsersList from 'screens/ProfileConnections/components/UsersList';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import useFollowing from 'hooks/relationships/useFollowing';
import { Center } from 'native-base';
import sleep from 'lib/sleep';
import StyledSpinner from 'components/StyledSpinner';

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
    refetch: refreshFollowing,
    refreshing,
  } = useFollowing(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    React.useCallback(() => {
      // Hack to correctly display the spinner
      refreshFollowing().then(() => sleep(500).then(() => setFirstFocus(false)));
      // It's fine to disable the next line lint in order to fetch the posts only on the first page load
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

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
