import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useTheme } from 'native-base';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import { FlashList } from '@shopify/flash-list';
import { isCommentReply, Post } from 'types/posts';
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
import StyledSpinner from 'components/StyledSpinner';
import Typography from 'components/Typography';
import useStyles from './useStyles';
import { useHandleCreateComment, useHandleExpandCommentView, usePostData } from './hooks';

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

  readonly initialPostData?: Post;
}

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { goBack } = useNavigation<NavProps['navigation']>();

  const { params } = useRoute<NavProps['route']>();
  const { subspaceId, postId } = params;
  const postData = { subspaceId, id: postId } as Pick<Post, 'subspaceId' | 'id'>;

  // -------------------------------------------------------------------------------------
  // --- Loading states
  // -------------------------------------------------------------------------------------
  const [firstLoad, setFirstLoad] = useState(false);
  const [pageRefreshing, setPageRefreshing] = useState(false);

  // -------------------------------------------------------------------------------------
  // --- Views references
  // -------------------------------------------------------------------------------------

  const scrollViewRef = useRef<FlashList<Post>>(null);
  const { textInputRef, focusTextInputRef } = useFocusTextInputOnNavigate();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeProfile = useActiveProfile();

  // Post data
  const { post, loading: isPostLoading, refetch: refreshPost } = usePostData();

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { state, handleCreateComment } = useHandleCreateComment();

  const handleExpandCommentView = useHandleExpandCommentView();

  // Method used to refresh the post data
  const refreshPage = useCallback(async () => {
    setPageRefreshing(true);
    // Set first load to false in the event the user manually refreshes so the
    // flatList loading spinner will be shown
    setFirstLoad(false);
    await refreshPost();
    await refreshReactionsCount();
    await refreshComments();
    await refreshCommentsCount();
    await refreshTipsCount();
    await refreshInteractionsAuthors();
    setPageRefreshing(false);
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

  // Refresh the data on the focus of the screen
  useEffect(() => {
    setFirstLoad(true);
    refreshPage().finally(() => setFirstLoad(false));
    // Suppress the warning of the next line in order to update the data only on the first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Function uses to render the items inside the list of comments
  const renderItem = React.useCallback((info: ListRenderItemInfo<Post>) => {
    const { item } = info;
    const disabled = isCommentReply(item);
    return <CommentItem comment={item} disableInnerComment={disabled} />;
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Conditional rendering
  // -------------------------------------------------------------------------------------

  if (!post) {
    // If the post is loading, show the loading screen
    if (isPostLoading) {
      return (
        <SafeAreaView style={styles.emptyView}>
          <Typography.H1>hello world</Typography.H1>
          <StyledSpinner />
        </SafeAreaView>
      );
    }
    return (
      <SafeAreaView style={styles.emptyView}>
        <Typography.H1>Something went wrong when loading the post</Typography.H1>
      </SafeAreaView>
    );
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
        // Only show the loading indicator on the flatList if the user manually drags down on it
        refreshing={!firstLoad && pageRefreshing}
        onRefresh={refreshPage}
        ListHeaderComponent={<PostHeader handlePressComment={focusTextInputRef} post={post!} />}
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
