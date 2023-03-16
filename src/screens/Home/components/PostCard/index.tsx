import { loadingOrange } from 'assets/animations';
import {
  followBlackIcon,
  moreBlackIcon,
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
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { isPostPending, Post } from 'types/posts';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { useActiveAccountAddress } from '@recoil/accounts';
import useHasReacted from 'hooks/reactions/useHasReacted';
import usePostReactionsCount from 'hooks/reactions/usePostReactionsCount';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { getProfilePicture } from 'lib/ProfileUtils';
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
   * What to do if the post like button is pressed.
   */
  onPressLike: () => void;
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

  // Unwrap the props
  const {
    post,
    onPressAuthor,
    onPressFollow,
    onPressReport,
    onPressLike,
    onPressComment,
    onPressTip,
    onPressDetails,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Menu visibility
  // -------------------------------------------------------------------------------------

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();

  // -------------------------------------------------------------------------------------
  // --- Utility hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const isFollowing = useIsFollowing(post.author.address);
  const hasReacted = useHasReacted(post);
  const { count: reactionsCount } = usePostReactionsCount(post);
  const { count: commentsCount } = usePostCommentsCount(post);

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
      return (
        <ImageButton
          onPress={event => {
            setMenuAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setMenuVisible(true);
          }}
          tintColor={theme.colors.surfaceBlack}
          image={moreBlackIcon}
          buttonStyle={{
            marginTop: theme.spacing.s,
            marginRight: theme.spacing.xs,
          }}
          style={{ width: 20, height: 20 }}
        />
      );
    }
  }, [
    isPending,
    isCurrentUserAuthor,
    styles.pendingIcon,
    theme.colors.surfaceBlack,
    theme.spacing.s,
    theme.spacing.xs,
  ]);

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
        {PendingIndicator}
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
            tintColor={hasReacted ? theme.colors.butterOrange01 : theme.colors.grey02}
            image={hasReacted ? postLikedIcon : postToLikeIcon}
            style={styles.bottomBarIcon}
          />
          <Typography.Subtitle3
            style={
              hasReacted ? { color: theme.colors.butterOrange01 } : { color: theme.colors.grey02 }
            }>
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
        {!isCurrentUserAuthor && (
          <TouchableOpacity
            onPress={onPressTip}
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
        )}
      </View>
    );
  }, [
    styles.bottomBarView,
    styles.bottomBarInnerView,
    styles.bottomBarIcon,
    styles.commentButton,
    onPressLike,
    hasReacted,
    theme.colors.butterOrange01,
    theme.colors.grey02,
    theme.spacing.s,
    reactionsCount,
    onPressComment,
    commentsCount,
    onPressTip,
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
      <PopupMenu
        anchor={menuAnchor}
        visible={menuVisible}
        closeMenu={() => setMenuVisible(false)}
        menuItems={[
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
        ]}
      />
    </TouchableOpacity>
  );
};

export default memo(PostCard);
