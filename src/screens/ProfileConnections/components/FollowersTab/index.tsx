import React, { useState } from 'react';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import useFollowers from 'hooks/relationships/useFollowers';
import sleep from 'lib/sleep';
import { View } from 'react-native';
import { Center, Spinner } from 'native-base';
import { makeStyle } from 'config/theme';
import UsersList from '../UsersList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_FOLLOWERS>;

/**
 * Tab that displays the followers of a given account.
 * @constructor
 */
const FollowersTab = () => {
  const { t } = useTranslation('followersAndFollowing');
  const styles = useStyles();
  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;
  const [firstFocus, setFirstFocus] = useState(true);
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

  useFocusEffect(
    React.useCallback(() => {
      // Hack to correctly display the spinner
      refreshFollowers().then(() => sleep(500).then(() => setFirstFocus(false)));
      // It's fine to disable the next line lint in order to fetch the posts only on the first page load
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (firstFocus) {
    return (
      <View style={styles.loadingView}>
        <Center>
          <Spinner />
        </Center>
      </View>
    );
  }

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

const useStyles = makeStyle(theme => ({
  loadingView: { flex: 1, flexGrow: 1, backgroundColor: theme.colors.white },
}));

export default FollowersTab;
