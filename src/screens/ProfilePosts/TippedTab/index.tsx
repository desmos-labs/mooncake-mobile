import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {useNavigation} from '@react-navigation/native';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {FlatList, View} from 'react-native';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import useStyles from './useStyles';

type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.PROFILE_POSTS_LIKED
>;

export const LikedTab = () => {
  const styles = useStyles();
  const {navigate} = useNavigation<NavProps['navigation']>();

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
        data={[]}
        renderItem={renderPosts}
        numColumns={3}
        contentContainerStyle={styles.contentContainerStyle}
        ListEmptyComponent={EmptyPostComponent}
      />
    </View>
  );
};

export default LikedTab;
