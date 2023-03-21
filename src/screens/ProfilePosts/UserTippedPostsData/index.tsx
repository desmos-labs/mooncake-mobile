import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserPostsList from 'screens/ProfilePosts/UserPostsList';
import usePostsTippedByAddress from 'hooks/tips/usePostsTippedByAddress';
import sleep from 'lib/sleep';
import { Center, Spinner } from 'native-base';
import { View } from 'react-native';
import useStyles from './useStyles';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS_LIKED>;

/**
 * Tab screen that allows the user to view all the posts that have been tipped by a user.
 * @constructor
 */
export const UserTippedPostsTab = () => {
  const { t } = useTranslation('profile');
  const styles = useStyles();
  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;
  const [firstFocus, setFirstFocus] = useState(true);
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    posts,
    loading: arePostsLoading,
    fetchMore,
    fetchingMore,
    refetch: refreshPosts,
    refreshing,
  } = usePostsTippedByAddress(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    React.useCallback(() => {
      // Hack to correctly display the spinner
      refreshPosts().then(() => sleep(500).then(() => setFirstFocus(false)));
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
    <UserPostsList
      posts={posts}
      isLoading={arePostsLoading}
      fetchMore={fetchMore}
      fetchingMore={fetchingMore}
      refreshPosts={refreshPosts}
      refreshing={refreshing}
      emptyListText={t('noTipsYet')}
      emptyListButtonText={t('browsePosts')}
    />
  );
};

export default UserTippedPostsTab;
