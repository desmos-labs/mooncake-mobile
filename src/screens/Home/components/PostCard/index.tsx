import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import { isPostPending, Post } from 'types/posts';
import PostCardBottomBar from 'screens/Home/components/PostCardBottomBar';
import PostCardProfileInfo from 'screens/Home/components/PostCardProfileInfo';
import useStyles from './useStyles';

interface PostCardProps {
  /**
   * Post that is related to this card.
   */
  post: Post;
  /**
   * What to do when the author's avatar, name, or DTag is pressed.
   */
  onPressAuthor: () => void;
  /**
   * What to do when the report button is pressed.
   */
  onPressReport: () => void;
  /**
   * What to do if the follow button is pressed.
   */
  onPressFollow: () => void;
  /**
   * What to do if the entire post is pressed.
   */
  onPressDetails: () => void;
  /**
   * What to do if the post comment button is pressed.
   */
  onPressComment: () => void;
  /**
   * What to do if the post tip button is pressed.
   */
  onPressTip: () => void;

  /**
   * What to do if the block popup menu is pressed.
   */
  onPressBlock: () => void;
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

  const {
    post,
    onPressAuthor,
    onPressFollow,
    onPressReport,
    onPressComment,
    onPressTip,
    onPressDetails,
    onPressBlock,
  } = props;

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
    imageStyle: { borderRadius: 10, backgroundColor: theme.colors.background },
    resizeMode: 'contain',
  });

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPressDetails}>
      {/* Post author info */}
      <PostCardProfileInfo
        post={post}
        onPressAuthor={onPressAuthor}
        onPressFollow={onPressFollow}
        onPressReport={onPressReport}
        onPressBlock={onPressBlock}
      />

      {/* Post text */}
      {post.text && (
        <Typography.Body6 style={{ marginTop: theme.spacing.m }}>{post.text}</Typography.Body6>
      )}

      {/* Media view */}
      {MediaAttachment && <View style={styles.mediaView}>{MediaAttachment}</View>}

      {/* Post bottom bar */}
      {!isPending && (
        <PostCardBottomBar post={post} onPressComment={onPressComment} onPressTip={onPressTip} />
      )}
    </TouchableOpacity>
  );
};

export default PostCard;
