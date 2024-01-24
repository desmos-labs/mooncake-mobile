import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import StyledSpinner from 'components/StyledSpinner';
import useFollowers from 'hooks/relationships/useFollowers';
import sleep from 'lib/sleep';
import { Center } from 'native-base';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useEffect, useState } from 'react';
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
  const [firstFocus, setFirstFocus] = useState(true);
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    data: followers,
    loading,
    initialLoading: isFirstLoad,
    fetchMore,
    refresh: refreshFollowers,
    refreshing,
  } = useFollowers(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshFollowers().then(() => sleep(500).then(() => setFirstFocus(false)));
  }, [refreshFollowers]);

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
      users={followers}
      loading={loading}
      fetchMore={fetchMore}
      fetchingMore={loading && !isFirstLoad}
      refresh={refreshFollowers}
      refreshing={refreshing}
      emptyText={t('noFollowers')}
    />
  );
};

export default FollowersTab;
