import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import usePostsLikedByAddress from 'hooks/posts/usePostsLikedByAddress';
import UserPostsList from 'screens/ProfilePosts/UserPostsList';
import sleep from 'lib/sleep';
import { Box, Center } from 'native-base';
import StyledSpinner from 'components/StyledSpinner';

type NavProps = MaterialTopTabScreenProps<RootNavigatorParamList, ROUTES.PROFILE_POSTS_LIKED>;

/**
 * Tab screen that allows the user to view all the posts that have been liked by a user.
 * @constructor
 */
export const UserLikedPostsTab = () => {
  const { t } = useTranslation('profile');
  const { params } = useRoute<NavProps['route']>();
  const { userAddress } = params;
  const [firstFocus, setFirstFocus] = useState(true);
  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const {
    data: posts,
    loading: arePostsLoading,
    fetchMore,
    refresh: refreshPosts,
    refreshing,
  } = usePostsLikedByAddress(userAddress);

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
      <Box flex={1} flexGrow={1} backgroundColor="white">
        <Center>
          <StyledSpinner />
        </Center>
      </Box>
    );
  }

  return (
    <UserPostsList
      posts={posts}
      isLoading={arePostsLoading}
      fetchMore={fetchMore}
      refreshPosts={refreshPosts}
      refreshing={refreshing}
      emptyListText={t('noLikesYet')}
      emptyListButtonText={t('browsePosts')}
    />
  );
};

export default UserLikedPostsTab;
