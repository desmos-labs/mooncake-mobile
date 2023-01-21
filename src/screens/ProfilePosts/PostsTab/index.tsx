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
import {ActivityIndicator, FlatList, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import GetPostsForAddress from 'services/graphql/queries/GetPostsForAddress';
import useStyles from './useStyles';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.PROFILE_POSTS_POSTS
>;

export type PostsTabParams = {
  userAddress: string;
};

export const PostsTab = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('profile');
  const {
    data: postsData,
    loading: postsLoading,
    refetch: postsRefetch,
  } = useQuery(GetPostsForAddress, {
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
    await postsRefetch({address: params.userAddress});
  };

  const posts: [] = React.useMemo(() => {
    if (!postsData) return [];
    return postsData.post;
  }, [postsData, postsLoading]);

  const handlePostPressed = React.useCallback(
    ({subspaceId, id}: {subspaceId: number; id: number}) => {
      navigate(ROUTES.POST_DETAILS, {
        subspaceId,
        postId: id,
        focusCommentBox: false,
      });
    },
    [],
  );

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postData={item}
      postsSize={97}
      postsMargin={6}
      onPress={() =>
        handlePostPressed({
          subspaceId: item.subspace_id,
          id: item.id,
        })
      }
    />
  );

  return (
    <View style={styles.contentContainer}>
      {posts.length > 0 && !postsLoading ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          refreshing={postsLoading}
          onRefresh={pageRefetch}
          data={posts}
          renderItem={renderPosts}
          numColumns={3}
          contentContainerStyle={styles.contentContainerStyle}
          ListEmptyComponent={
            !posts.length ? null : (
              <EmptyPostComponent
                textLabel={t('noUserPosts')}
                buttonLabel={t('createPost')}
              />
            )
          }
        />
      ) : (
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      )}
    </View>
  );
};

export default PostsTab;
