import { useActiveAccountAddress } from '@recoil/accounts';
import { postLikedIcon, postToCommentIcon, postToLikeIcon, postToTipIcon } from 'assets/images';
import ImageButton from 'components/ImageButton';
import Typography from 'components/Typography';
import { Image } from 'expo-image';
import useCustomToast from 'hooks/extended/useCustomToast';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import { useTheme } from 'native-base';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

export interface PostBottomBarProps {
  readonly post: Post;
  readonly onPressComment: () => void;
  readonly onPressTip: () => void;
}

/**
 * Bottom bar that contains the buttons to interact with a post.
 * @constructor
 */
const PostCardBottomBar = (props: PostBottomBarProps) => {
  const { t } = useTranslation('home');
  const styles = useStyles();
  const theme = useTheme();
  const toast = useCustomToast();

  const { post, onPressComment, onPressTip } = props;

  // -------------------------------------------------------------------------------------
  // --- Utility hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
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
  // --- Memoized variables
  // -------------------------------------------------------------------------------------

  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  // -------------------------------------------------------------------------------------
  // --- Callbacks
  // -------------------------------------------------------------------------------------

  const onPressLike = useCallback(async () => {
    if (isPostPending(post)) {
      return toast.success(t('toast:postTxInProgress'));
    }
    addOrRemoveLike(post);
  }, [addOrRemoveLike, post, t, toast]);

  /**
   * Checks if the current user is the author of the post and shows a toast if that's the case or calls the handler to send tips
   */
  const checkUserAndHandleSendTips = useCallback(() => {
    if (isCurrentUserAuthor) {
      toast.errorNoRetry(t('common:cannot tip yourself'));
    } else {
      onPressTip();
    }
  }, [onPressTip, isCurrentUserAuthor, t, toast]);

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

      {/* I have completely removed the logic that changed the color of the button based on whether */}
      {/* the user tipped the post or not. This has been done for the following reasons: */}
      {/* 1. It's a bad UX: no social network changes the color of the buttons for this reason */}
      {/* 2. It's extremely hard to implement, and completely useless in the first place */}
      {!isCurrentUserAuthor && (
        <TouchableOpacity onPress={checkUserAndHandleSendTips} style={styles.tipButton}>
          <Image contentFit="cover" source={postToTipIcon} style={styles.bottomBarIcon} />
          <Typography.Subtitle3 style={{ color: theme.colors.grey02 }}>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostCardBottomBar;
