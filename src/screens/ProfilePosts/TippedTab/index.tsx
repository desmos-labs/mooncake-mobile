import {useQuery} from '@apollo/client';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import EnvConfig from 'config/EnvConfig';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import {GetTippedPostsFromAddress} from 'services/graphql/queries/GetPostTips';
import useStyles from './useStyles';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.PROFILE_POSTS_LIKED
>;

export const TippedTab = () => {
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {t} = useTranslation('profile');
  const theme = useTheme();

  const {
    data: postsData,
    loading: postsLoading,
    refetch: postsRefetch,
  } = useQuery(GetTippedPostsFromAddress, {
    variables: {
      subspaceID: EnvConfig.APP_SUBSPACE_ID,
      user: params.userAddress,
    },
    fetchPolicy: 'no-cache',
  });

  useFocusEffect(
    React.useCallback(() => {
      pageRefetch();
    }, [params]),
  );

  const pageRefetch = async () => {
    await postsRefetch();
  };

  const posts: [] = React.useMemo(() => {
    if (!postsData) return [];
    return postsData.tip_post;
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

  const renderPosts = ({item}: any) => {
    return (
      <ProfilePostCard
        postData={item.post}
        postsSize={97}
        postsMargin={6}
        onPress={() =>
          handlePostPressed({
            subspaceID: item.post.subspace_id,
            id: item.post.id,
          })
        }
      />
    );
  };

  return (
    <View style={styles.contentContainer}>
      <FlatList
        refreshing={postsLoading}
        onRefresh={pageRefetch}
        showsVerticalScrollIndicator={false}
        data={_.uniqBy(posts, 'post.id')}
        renderItem={renderPosts}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={
          <EmptyPostComponent
            textLabel={t('noTipsYet')}
            buttonLabel={t('browsePosts')}
          />
        }
      />
    </View>
  );
};

export default TippedTab;
