import { postLikedIcon, postToCommentIcon, postToLikeIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import { useTheme } from 'native-base';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

export interface PostBottomBarProps {
  readonly post: Post;
  readonly onPressComment: () => void;
}

/**
 * Bottom bar that contains the buttons to interact with a post.
 * @constructor
 */
const PostCardBottomBar = (props: PostBottomBarProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const { post, onPressComment } = props;

  // -------------------------------------------------------------------------------------
  // --- Utility hooks
  // -------------------------------------------------------------------------------------

  const { count: reactionsCount, refetch: refreshReactionsCount } = usePostReactionsCount(post);
  const { count: commentsCount, refetch: refreshCommentsCount } = usePostCommentsCount(post);

  const { liked, addOrRemoveLike } = useAddOrRemoveLike(post);

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  React.useEffect(() => {
    refreshReactionsCount();
    refreshCommentsCount();
  }, [refreshCommentsCount, refreshReactionsCount]);

  // -------------------------------------------------------------------------------------
  // --- Callbacks
  // -------------------------------------------------------------------------------------

  const onPressLike = useCallback(async () => {
    if (isPostPending(post)) {
      return;
    }
    addOrRemoveLike(post);
  }, [addOrRemoveLike, post]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.bottomBarView}>
      <View style={styles.bottomBarInnerView}>
        <ImageButton
          onPress={onPressLike}
          tintColor={liked ? theme.colors.butterOrange01 : theme.colors.grey02}
          image={liked ? postLikedIcon : postToLikeIcon}
          style={styles.bottomBarIcon}
        />
        <Typography.Subtitle3
          style={liked ? { color: theme.colors.butterOrange01 } : { color: theme.colors.grey02 }}>
          {reactionsCount}
        </Typography.Subtitle3>

        {/* I have completely removed the logic that changed the color of the button based on whether */}
        {/* the user comment the post or not. This has been done for the following reasons: */}
        {/* 1. It's a bad UX: no social network changes the color of the buttons for this reason */}
        {/* 2. It's extremely hard to implement, and completely useless in the first place */}
        <TouchableOpacity onPress={onPressComment} style={styles.commentButton}>
          <Image
            contentFit="cover"
            tintColor={theme.colors.grey02}
            source={postToCommentIcon}
            style={styles.bottomBarIcon}
          />
          <Typography.Subtitle3 style={{ color: theme.colors.grey02 }}>
            {commentsCount}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCardBottomBar;
