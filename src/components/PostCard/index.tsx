import {
  useHandlePressBlock,
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressHidePost,
  useHandlePressReport,
} from 'components/PostCard/hooks';
import PostData from 'components/PostData';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useSharePost from 'hooks/posts/useSharePost';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import PostCardBottomBar from 'screens/Home/components/PostCardBottomBar';
import PostCardProfileInfo from 'screens/Home/components/PostCardProfileInfo';
import { isCommentReply, isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

interface PostCardProps {
  /**
   * Post that is related to this card.
   */
  post: Post;
}

/**
 * Card that allows properly displaying a single post inside a view.
 *
 * <b>Note</b>
 * The dimensions of this card should be managed by the parent using it.
 * @constructor
 */
const PostCard = (props: PostCardProps) => {
  const styles = useStyles();
  const { post } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------
  const navigateToProfile = useNavigateToProfile();
  const followOrUnfollowUser = useFollowOrUnfollowUser();
  const handlePressDetails = useHandlePressDetails();
  const handlePressHidePost = useHandlePressHidePost();
  const handlePressComments = useHandlePressComments();
  const handlePressReport = useHandlePressReport();
  const handlePressBlock = useHandlePressBlock();
  const sharePost = useSharePost(post.id);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------
  const onPressAuthor = React.useCallback(() => {
    if (isPostPending(post)) {
      return;
    }
    navigateToProfile(post.author.address);
  }, [navigateToProfile, post]);

  const onPressFollowOrUnFollow = React.useCallback(() => {
    followOrUnfollowUser(post.author);
  }, [followOrUnfollowUser, post]);

  const onPressDetails = React.useCallback(() => {
    if (isPostPending(post) || isCommentReply(post)) {
      return;
    }
    handlePressDetails(post);
  }, [handlePressDetails, post]);

  const onPressReport = React.useCallback(() => {
    handlePressReport(post);
  }, [handlePressReport, post]);

  const onPressHide = React.useCallback(() => {
    handlePressHidePost(post);
  }, [handlePressHidePost, post]);

  const onPressComment = React.useCallback(() => {
    if (isPostPending(post)) {
      return;
    }
    handlePressComments(post);
  }, [handlePressComments, post]);

  const onPressBlock = React.useCallback(() => {
    handlePressBlock(post.author);
  }, [handlePressBlock, post.author]);

  // -------------------------------------------------------------------------------------
  // --- Memoized variables
  // -------------------------------------------------------------------------------------

  const isPending = useMemo(() => isPostPending(post), [post]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  return (
    <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
      <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPressDetails}>
        {/* Post author info */}
        <PostCardProfileInfo
          post={post}
          onPressAuthor={onPressAuthor}
          onPressFollow={onPressFollowOrUnFollow}
          onPressReport={onPressReport}
          onPressHide={onPressHide}
          onPressBlock={onPressBlock}
        />

        {/* Post data */}
        <PostData post={post} />

        {/* Post bottom bar */}
        {!isPending && (
          <PostCardBottomBar post={post} onPressComment={onPressComment} onPressShare={sharePost} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PostCard;
