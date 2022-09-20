import {useQuery} from '@apollo/client';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import EnvConfig from 'config/EnvConfig';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import GetPostsLikedFromAddress from 'services/graphql/queries/GetPostsLikedFromAddress';
import useStyles from './useStyles';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.PROFILE_POSTS_LIKED
>;

export const LikedTab = () => {
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('profile');

  const {
    data: postsData,
    loading: postsLoading,
    refetch: postsRefetch,
  } = useQuery(GetPostsLikedFromAddress, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      address: params.userAddress,
    },
    fetchPolicy: 'no-cache',
  });

  useFocusEffect(
    React.useCallback(() => {
      pageRefetch();
    }, [params]),
  );

  const pageRefetch = async () => {
    await postsRefetch({subspaceID: 5, address: params.userAddress});
  };

  const posts: [] = React.useMemo(() => {
    if (!postsData) return [];
    return postsData.reaction;
  }, [postsData, postsLoading]);

  const handlePostPressed = React.useCallback(
    ({subspaceID, id}: {subspaceID: number; id: number}) => {
      navigate(ROUTES.POST_DETAILS, {
        subspaceID,
        postId: id,
        focusCommentBox: false,
      });
    },
    [],
  );

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postData={item.post}
      onPress={() =>
        handlePostPressed({
          subspaceID: item.post.subspace_id,
          id: item.post.id,
        })
      }
    />
  );

  return (
    <View style={styles.contentContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={postsLoading}
        onRefresh={pageRefetch}
        data={posts}
        renderItem={renderPosts}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={
          <EmptyPostComponent
            textLabel={t('noLikesYet')}
            buttonLabel={t('browsePosts')}
          />
        }
      />
    </View>
  );
};

export default LikedTab;
