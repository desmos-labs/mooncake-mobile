import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { useTheme } from '@react-navigation/native';
import { usePostCommentsCount } from '@recoil/commentsCount';
import { postLikedIcon, postShareIcon, postToCommentIcon, postToLikeIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import { Image } from 'expo-image';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import React, { useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

interface PostBottomBarProps {
  /**
   * Post that is related to this card.
   */
  readonly post: Post;
  /**
   * Callback that is called when the user presses the comment button.
   */
  readonly onPressComment: () => void;
  /**
   * Callback that is called when the user presses the share button.
   */
  readonly onPressShare: () => void;
}

/**
 * Bottom bar that contains the buttons to interact with a post.
 * @constructor
 */
const PostCardBottomBar = (props: PostBottomBarProps) => {
  const styles = useStyles();
  const theme = useTheme();

  const { post, onPressComment, onPressShare } = props;

  // -------------------------------------------------------------------------------------
  // --- Utility hooks
  // -------------------------------------------------------------------------------------

  const commentsCount = usePostCommentsCount(post.id);

  const { liked, addOrRemoveLike, likesCount } = useAddOrRemoveLike(post);

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
        <View style={styles.leftButtonsGroup}>
          <ImageButton
            onPress={onPressLike}
            tintColor={liked ? theme.colors.primary : theme.colors.neutralVariants['700']}
            image={liked ? postLikedIcon : postToLikeIcon}
            style={styles.bottomBarIcon}
          />
          <Typography.Regular16
            style={
              liked
                ? { color: theme.colors.primary }
                : { color: theme.colors.neutralVariants['700'] }
            }>
            {likesCount > 0 ? likesCount : ''}
          </Typography.Regular16>
          {/* I have completely removed the logic that changed the color of the button based on whether */}
          {/* the user comment the post or not. This has been done for the following reasons: */}
          {/* 1. It's a bad UX: no social network changes the color of the buttons for this reason */}
          {/* 2. It's extremely hard to implement, and completely useless in the first place */}
          <TouchableOpacity onPress={onPressComment} style={styles.commentButton}>
            <Image
              contentFit="cover"
              tintColor={theme.colors.neutralVariants['700']}
              source={postToCommentIcon}
              style={styles.bottomBarIcon}
            />
            <Typography.Regular16 style={{ color: theme.colors.neutralVariants['700'] }}>
              {commentsCount > 0 ? commentsCount : ''}
            </Typography.Regular16>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onPressShare}>
          <Image
            contentFit="cover"
            tintColor={theme.colors.neutralVariants['700']}
            source={postShareIcon}
            style={styles.bottomBarIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PostCardBottomBar;
