import { loadingOrange } from 'assets/animations';
import {
  followBlackIcon,
  postLikedIcon,
  postToCommentIcon,
  postToLikeIcon,
  postToTipIcon,
  reportIcon,
  unfollowBlackIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import { parseISO } from 'date-fns';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { formatMsToHumanReadable } from 'lib/FormatUtils';
import React, { memo, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Center, useTheme } from 'native-base';
import { isPostPending, Post } from 'types/posts';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { useActiveAccountAddress } from '@recoil/accounts';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { getProfilePicture } from 'lib/ProfileUtils';
import ToastConfig from 'config/ToastConfig';
import { useToast } from 'react-native-toast-notifications';
import useAddOrRemoveLike from 'hooks/reactions/useAddOrRemoveLike';
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
  const { t } = useTranslation('home');
  const toast = useToast();
  // Unwrap the props
  const {
    post,
    onPressAuthor,
    onPressFollow,
    onPressReport,
    onPressComment,
    onPressTip,
    onPressDetails,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Utility hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const isFollowing = useIsFollowing(post.author.address);
  const { count: reactionsCount } = usePostReactionsCount(post);
  const { count: commentsCount } = usePostCommentsCount(post);

  // -------------------------------------------------------------------------------------
  // --- Popup Menu Items
  // -------------------------------------------------------------------------------------

  const popupMenuItems = React.useMemo(
    () => [
      {
        label: isFollowing ? t('unfollow') : t('follow'),
        onPress: onPressFollow,
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('report'),
        onPress: onPressReport,
        icon: reportIcon,
      },
    ],
    [isFollowing, t, onPressFollow, onPressReport],
  );

  // -------------------------------------------------------------------------------------
  // --- Formatted data
  // -------------------------------------------------------------------------------------

  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  const isPending = useMemo(() => isPostPending(post), [post]);

  const formatDate = useFormatTimeForPostDetails();
  const formattedDate = formatDate(post.creationDate);
  const calculatedCreationDate = useMemo(() => {
    const parsedTime = parseISO(`${post.creationDate}Z`);
    const now = new Date();

    const differenceInUnix = now.getTime() - parsedTime.getTime();
    if (differenceInUnix < 59999) {
      return t('seconds ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'seconds'),
      });
    } else if (differenceInUnix < 3599999) {
      return t('minutes ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'minutes'),
      });
    } else if (differenceInUnix < 86399999) {
      return t('hours ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'hours'),
      });
    } else if (differenceInUnix < 31556951999) {
      return t('days ago', {
        count: formatMsToHumanReadable(differenceInUnix, 'days'),
      });
    } else {
      return formattedDate;
    }
  }, [formattedDate, post.creationDate, t]);

  // -------------------------------------------------------------------------------------
  // --- Utility functions
  // -------------------------------------------------------------------------------------

  /**
   * Checks if the current user is the author of the post and shows a toast if that's the case or calls the handler to send tips
   */
  const checkUserAndHandleSendTips = useCallback(() => {
    if (isCurrentUserAuthor) {
      toast.show(t('common:cannot tip yourself'), {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    } else {
      onPressTip();
    }
  }, [onPressTip, isCurrentUserAuthor, t, toast]);

  // -------------------------------------------------------------------------------------
  // --- Handles
  // -------------------------------------------------------------------------------------

  const { liked, addOrRemoveLike } = useAddOrRemoveLike(post);
  const onPressLike = useCallback(async () => {
    if (isPostPending(post)) {
      return toast.show(t('toast:postTxInProgress'), {
        type: ToastConfig.ERROR_NO_RETRY,
      });
    }
    addOrRemoveLike(post);
  }, [addOrRemoveLike, post, t, toast]);

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  const { MediaAttachment } = useRenderMediaAttachment(post.attachments, {
    useAutoSize: true,
    horizontalPaddingWithAutoSize: 32,
    imageStyle: { borderRadius: 10, backgroundColor: theme.colors.background },
    resizeMode: 'contain',
  });

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return <ThemedLottieView source={loadingOrange} autoPlay style={styles.pendingIcon} />;
    } else if (!isCurrentUserAuthor) {
      return <PopupMenu menuItems={popupMenuItems} />;
    }
  }, [popupMenuItems, isPending, isCurrentUserAuthor, styles.pendingIcon]);

  const ProfileInfo = React.useMemo(() => {
    return (
      <View style={styles.profileInfoView}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPressAuthor}>
          <FastImage source={getProfilePicture(post.author)} style={styles.profilePic} />
          <View style={{ flexDirection: 'column' }}>
            <Typography.Subtitle2>{post.author.nickname}</Typography.Subtitle2>
            <View style={{ flexDirection: 'row' }}>
              <Typography.Body6 style={{ color: theme.colors.midGrey }}>
                @{post.author.dTag}
              </Typography.Body6>
              <Typography.Body6
                style={{
                  color: theme.colors.midGrey,
                  marginLeft: theme.spacing.xs,
                }}>
                {!isPending && `· ${calculatedCreationDate}`}
              </Typography.Body6>
            </View>
          </View>
        </TouchableOpacity>
        <Center justifyContent="flex-start">{PendingIndicator}</Center>
      </View>
    );
  }, [
    styles.profileInfoView,
    styles.profilePic,
    onPressAuthor,
    post.author,
    theme.colors.midGrey,
    theme.spacing.xs,
    isPending,
    calculatedCreationDate,
    PendingIndicator,
  ]);

  const BottomBar = React.useMemo(() => {
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
            <FastImage
              resizeMode="cover"
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
        <TouchableOpacity
          onPress={checkUserAndHandleSendTips}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: theme.spacing.s,
          }}>
          <FastImage resizeMode="cover" source={postToTipIcon} style={styles.bottomBarIcon} />
          <Typography.Subtitle3 style={{ color: theme.colors.grey02 }}>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
    );
  }, [
    styles.bottomBarView,
    styles.bottomBarInnerView,
    styles.bottomBarIcon,
    styles.commentButton,
    onPressLike,
    liked,
    theme.colors.butterOrange01,
    theme.colors.grey02,
    theme.spacing.s,
    reactionsCount,
    onPressComment,
    commentsCount,
    checkUserAndHandleSendTips,
    t,
  ]);

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.container} onPress={onPressDetails}>
      {ProfileInfo}
      {post.text && (
        <Typography.Body6 style={{ marginTop: theme.spacing.m }}>{post.text}</Typography.Body6>
      )}
      {MediaAttachment && <View style={styles.mediaView}>{MediaAttachment}</View>}
      {!isPending && BottomBar}
    </TouchableOpacity>
  );
};

export default memo(PostCard);
