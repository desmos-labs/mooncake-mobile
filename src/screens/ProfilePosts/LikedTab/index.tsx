import {useQuery} from '@apollo/client';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
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

  const spec = {
    '@type': '/desmos.reactions.v1.RegisteredReactionValue',
    registered_reaction_id: 9,
  };

  const {
    data: postsData,
    loading: postsLoading,
    refetch: postsRefetch,
  } = useQuery(GetPostsLikedFromAddress, {
    variables: {
      subspaceID: 5,
      address: params.userAddress,
      spec,
    },
  });

  const posts: [] = React.useMemo(() => {
    console.log('likedPosts', postsData);
    if (!postsData) return [];
    return postsData.post;
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
      postData={item}
      onPress={() =>
        handlePostPressed({
          subspaceID: item.subspace_id,
          id: item.id,
        })
      }
    />
  );

  return (
    <View style={styles.contentContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={postsLoading}
        onRefresh={() => postsRefetch({address: params.userAddress})}
        data={posts}
        renderItem={renderPosts}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={EmptyPostComponent}
      />
    </View>
  );
};

export default LikedTab;
