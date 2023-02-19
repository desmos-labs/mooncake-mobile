import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import usePostsCreatedByAddress from 'hooks/posts/usePostsCreatedByAddress';
import UserPostsList from 'screens/ProfilePosts/UserPostsList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS_POSTS>;

/**
 * Tab screen that allows the user to view all the posts that have been created by a user.
 * @constructor
 */
export const UserPostsTab = () => {
  const { t } = useTranslation('profile');

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

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
  } = usePostsCreatedByAddress(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    React.useCallback(() => {
      refreshPosts();
      // It's fine to disable the next line lint in order to fetch the posts only on the first page load
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <UserPostsList
      posts={posts}
      isLoading={arePostsLoading}
      fetchMore={fetchMore}
      fetchingMore={fetchingMore}
      refreshPosts={refreshPosts}
      refreshing={refreshing}
      emptyListText={t('noUserPosts')}
      emptyListButtonText={t('createPost')}
    />
  );
};

export default UserPostsTab;
