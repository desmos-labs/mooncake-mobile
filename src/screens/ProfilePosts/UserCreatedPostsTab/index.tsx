import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useRoute } from '@react-navigation/native';
import usePostsCreatedByAddress from 'hooks/posts/usePostsCreatedByAddress';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import UserPostsList from 'screens/ProfilePosts/UserPostsList';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS_POSTS>;

/**
 * Tab screen that allows the user to view all the posts that have been created by a user.
 * @constructor
 */
const UserPostsTab = () => {
  const { t } = useTranslation('profile');

  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    items: posts,
    loading,
    fetchMore,
    refresh: refreshPosts,
    refreshing,
  } = usePostsCreatedByAddress(userAddress);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <UserPostsList
      loading={loading}
      posts={posts}
      fetchMore={fetchMore}
      refreshPosts={refreshPosts}
      refreshing={refreshing}
      emptyListText={t('noPosts')}
    />
  );
};

export default UserPostsTab;
