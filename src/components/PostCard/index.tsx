import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
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
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import { useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import PostCardBottomBar from 'screens/Home/components/PostCardBottomBar';
import PostCardProfileInfo from 'screens/Home/components/PostCardProfileInfo';
import { isPostPending, Post } from 'types/posts';
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
  const theme = useTheme();

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
    if (isPostPending(post)) {
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

  const { MediaAttachment } = useRenderMediaAttachment(post.attachments, {
    useAutoSize: true,
    horizontalPaddingWithAutoSize: 32,
    imageStyle: { borderRadius: 10, backgroundColor: theme.colors.lightGrey01 },
    resizeMode: 'contain',
  });

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPressDetails}>
      {/* Post author info */}
      <PostCardProfileInfo
        post={post}
        onPressAuthor={onPressAuthor}
        onPressFollow={onPressFollowOrUnFollow}
        onPressReport={onPressReport}
        onPressHide={onPressHide}
        onPressBlock={onPressBlock}
        onPressShare={sharePost}
      />
      {/* Post text */}
      {post.text && (
        <Typography.Regular16 style={{ marginTop: theme.spacing.m }}>
          {post.text}
        </Typography.Regular16>
      )}
      {/* Media view */}
      {MediaAttachment && <View style={styles.mediaView}>{MediaAttachment}</View>}
      {/* Post bottom bar */}
      {!isPending && <PostCardBottomBar post={post} onPressComment={onPressComment} />}
    </TouchableOpacity>
  );
};

export default PostCard;
