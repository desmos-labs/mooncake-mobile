import {
  useHandlePressBlock,
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressHidePost,
  useHandlePressReport,
} from 'components/PostCard/hooks';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useSharePost from 'hooks/posts/useSharePost';
import useFollowOrUnfollowUser from 'hooks/relationships/useFollowOrUnfollowUser';
import { useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import PostCardBottomBar from 'screens/Home/components/PostCardBottomBar';
import PostCardProfileInfo from 'screens/Home/components/PostCardProfileInfo';
import { isCommentReply, isPostPending, Post } from 'types/posts';
import PostText from 'components/PostText';
import useRenderPostAttachment from 'hooks/rendering/useRenderPostAttachment';
import useStyles from './useStyles';

interface PostCardProps {
  /**
   * Post that is related to this card.
   */
  post: Post;
  /**
   * Timestamp of the last fetch of the post.
   * If this is provided, this will trigger a re-render of the post
   * if the post has been re-fetched.
   */
  fetchTimestamp?: Date;
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
  const theme = useTheme();
  const { post, fetchTimestamp } = props;

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
    handlePressHidePost(post.id);
  }, [handlePressHidePost, post.id]);

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

  const { Attachment } = useRenderPostAttachment(post, {
    media: {
      useAutoSize: true,
      horizontalPaddingWithAutoSize: 32,
      imageStyle: { borderRadius: 8, backgroundColor: theme.colors.neutral['300'] },
      resizeMode: 'contain',
    },
  });

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
        {/* Post text */}
        {post.text && <PostText style={{ marginTop: theme.spacing.m }}>{post.text}</PostText>}
        {/* Attachment */}
        {Attachment && <View style={styles.attachmentContainer}>{Attachment}</View>}
        {/* Post bottom bar */}
        {!isPending && (
          <PostCardBottomBar
            post={post}
            onPressComment={onPressComment}
            onPressShare={sharePost}
            fetchTimestamp={fetchTimestamp}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default PostCard;
