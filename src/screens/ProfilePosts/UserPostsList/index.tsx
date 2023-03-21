import React, { useCallback } from 'react';
import { ActivityIndicator, FlatList, ListRenderItemInfo, View } from 'react-native';
import { Post } from 'types/posts';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import EmptyPostComponent from 'screens/Profile/components/EmptyPostComponent';
import useNavigateToPost from 'hooks/navigation/useNavigateToPost';
import { Center, Spinner, useTheme } from 'native-base';
import useStyles from './useStyles';

export interface UserPostsListProps {
  /**
   * List of posts to render.
   */
  posts: Post[];
  /**
   * Whether the data is loading or not.
   */
  isLoading: boolean;
  /**
   * Action to be performed when the user scrolls to the end of the list.
   */
  fetchMore: () => void;
  /**
   * Whether more data is being loaded or not.
   */
  fetchingMore: boolean;
  /**
   * Action to be performed when the user pulls down the list.
   */
  refreshPosts: () => void;
  /**
   * Whether the list is refreshing or not.
   */
  refreshing: boolean;
  /**
   * Text to be displayed when the list is empty.
   */
  emptyListText: string;
  /**
   * Text to be displayed on the button when the list is empty.
   */
  emptyListButtonText: string;
}

/**
 * React component that, given a list of posts and a variable telling whether the data is loading or not,
 * renders a list of posts.
 */
const UserPostsList = (props: UserPostsListProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const {
    posts,
    isLoading,
    fetchMore,
    fetchingMore,
    refreshPosts,
    refreshing,
    emptyListText,
    emptyListButtonText,
  } = props;

  const navigateToPost = useNavigateToPost();

  // -------------------------------------------------------------------------------------
  // --- Children components
  // -------------------------------------------------------------------------------------

  const renderPosts = useCallback(
    ({ item: post }: ListRenderItemInfo<Post>) => {
      return (
        <ProfilePostCard
          post={post}
          postsSize={97}
          postsMargin={6}
          onPress={() => navigateToPost(post.subspaceId, post.id)}
        />
      );
    },
    [navigateToPost],
  );

  // Component this is rendered when the list is empty
  if (isLoading && posts.length === 0) {
    return <EmptyPostComponent textLabel={emptyListText} buttonLabel={emptyListButtonText} />;
  }

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  if (isLoading) {
    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator color={theme.colors.surfaceBlack} />
      </View>
    );
  }

  return (
    <View style={styles.contentContainer}>
      <FlatList
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={refreshPosts}
        data={posts}
        renderItem={renderPosts}
        numColumns={3}
        onEndReached={({ distanceFromEnd }) => {
          if (distanceFromEnd < 0) return;
          fetchMore();
        }}
        contentContainerStyle={styles.contentContainerStyle}
        ListFooterComponent={
          fetchingMore ? (
            <Center style={{ marginVertical: theme.spacing.m }}>
              <Spinner />
            </Center>
          ) : null
        }
      />
    </View>
  );
};

export default UserPostsList;
