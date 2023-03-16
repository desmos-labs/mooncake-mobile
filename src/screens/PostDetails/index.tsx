import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useRef } from 'react';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'native-base';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import { FlashList } from '@shopify/flash-list';
import { Post } from 'types/posts';
import usePost from 'hooks/posts/usePost';
import usePostComments from 'hooks/posts/comments/usePostComments';
import { ListRenderItemInfo } from '@shopify/flash-list/src/FlashListProps';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { useActiveProfile } from '@recoil/profiles';
import useFocusTextInputOnNavigate from 'hooks/useFocusTextInputOnNavigate';
import PostHeader from 'screens/PostDetails/components/PostHeader';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostTipsCount from 'hooks/tips/usePostTipsCount';
import usePostInteractionsAuthors from 'hooks/posts/usePostInteractionsAuthors';
import PostTopBar from 'screens/PostDetails/components/PostTopBar';
import useStyles from './useStyles';
import { useHandleCreateComment, useHandleExpandCommentView } from './hooks';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.POST_DETAILS>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export interface PostDetailsParams {
  /**
   * Subspace ID the post that should be visualized.
   */
  readonly subspaceId: number;

  /**
   * ID of the post that should be visualized.
   */
  readonly postId: number;
  /**
   * focus the comment box when navigating to this screen
   */
  readonly focusCommentBox?: boolean;
  /**
   * ID of the post to be focused within the list of comments.
   * TODO: Implement the scrolling of the list to this post
   */
  readonly focusPostId?: number;
}

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { goBack } = useNavigation<NavProps['navigation']>();

  const { params } = useRoute<NavProps['route']>();
  const { subspaceId, postId } = params;
  const postData = { subspaceId, id: postId } as Pick<Post, 'subspaceId' | 'id'>;

  // -------------------------------------------------------------------------------------
  // --- Views references
  // -------------------------------------------------------------------------------------

  const scrollViewRef = useRef<any>(null);
  const { textInputRef } = useFocusTextInputOnNavigate();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeProfile = useActiveProfile();

  // Post data
  const { post, loading: isPostLoading, refetch: refreshPost } = usePost(subspaceId, postId);

  // Comments data
  const {
    comments,
    loading: areCommentsLoading,
    refetch: refreshComments,
    fetchMore: fetchMoreComments,
  } = usePostComments(postData);
  const { refetch: refreshCommentsCount } = usePostCommentsCount(postData);

  // Reactions data
  const { refetch: refreshReactionsCount } = usePostReactionsCount(postData);

  // Tips data
  const { refetch: refreshTipsCount } = usePostTipsCount(postData);

  // Interactions data
  const { refetch: refreshInteractionsAuthors } = usePostInteractionsAuthors(postData, 3);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // TODO: Properly display the state of the comment creation
  const { state, handleCreateComment } = useHandleCreateComment();

  const handleExpandCommentView = useHandleExpandCommentView();

  // Method used to refresh the post data
  const refreshPage = useCallback(() => {
    refreshPost();
    refreshReactionsCount();
    refreshComments();
    refreshCommentsCount();
    refreshTipsCount();
    refreshInteractionsAuthors();
  }, [
    refreshComments,
    refreshCommentsCount,
    refreshInteractionsAuthors,
    refreshPost,
    refreshReactionsCount,
    refreshTipsCount,
  ]);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useFocusEffect(
    useCallback(() => {
      // Refresh the data
      refreshPage();
    }, []),
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Function uses to render the items inside the list of comments
  const renderItem = React.useCallback((info: ListRenderItemInfo<Post>) => {
    const { item } = info;
    return <CommentItem comment={item} />;
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Conditional rendering
  // -------------------------------------------------------------------------------------

  if (!post) {
    // If the post is loading, show the loading screen
    if (isPostLoading) {
      // TODO: Improve this in order to show the proper loading screen
      return <ActivityIndicator />;
    }

    // TODO: It's best to show an error here or something, as it means the post does not exist anymore
    goBack();
    return null;
  }

  // -------------------------------------------------------------------------------------
  // --- Rendering
  // -------------------------------------------------------------------------------------

  return (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={<PostTopBar post={post} onBackButtonPress={goBack} />}>
      {/* List of comments */}
      <FlashList
        estimatedItemSize={120}
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={isPostLoading}
        onRefresh={refreshPage}
        ListHeaderComponent={<PostHeader post={post!} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => item.externalId}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={comments}
        ListEmptyComponent={<EmptyListComponent label="No comments yet" />}
        keyboardDismissMode="on-drag"
        onEndReached={fetchMoreComments}
      />

      {/* Bottom bar allowing to create a new comment */}
      <EnterCommentBottomBar
        author={activeProfile}
        loading={areCommentsLoading}
        handlePostComment={() => handleCreateComment(post)}
        textInputRef={textInputRef}
        onIconPress={() => handleExpandCommentView(post)}
      />
    </DView>
  );
};

export default PostDetails;
