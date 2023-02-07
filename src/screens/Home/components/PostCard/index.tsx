import { loadingOrange } from 'assets/animations';
import {
  defaultProfilePic,
  followBlackIcon,
  moreBlackIcon,
  postCommentedIcon,
  postLikedIcon,
  postTippedIcon,
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
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import { formatMsToHumanReadable } from 'lib/FormatUtils';
import React, { memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'react-native-paper';
import { isPostPending, Post } from 'types/posts';
import useIsFollowing from 'hooks/useIsFollowing';
import { useActiveAccountAddress } from '@recoil/accounts';
import useHasCommented from 'hooks/useHasCommented';
import useHasReacted from 'hooks/useHasReacted';
import useReactionsCount from 'hooks/useReactionsCount';
import useHasTipped from 'hooks/useHasTipped';
import useCommentsCount from 'hooks/useCommentsCount';
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

  // --- Menu visibility --- //
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();

  // --- Utility hooks --- //
  const activeAddress = useActiveAccountAddress();
  const isFollowing = useIsFollowing(post.author.address);
  const hasReacted = useHasReacted(post);
  const { count: reactionsCount } = useReactionsCount(post);
  const hasCommented = useHasCommented(post);
  const { count: commentsCount } = useCommentsCount(post);
  const hasTipped = useHasTipped(post);

  // --- Formatted data --- //
  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  const authorProfilePic = useMemo(() => {
    return post.author.profilePicture ? { uri: post.author.profilePicture } : defaultProfilePic;
  }, [post]);

  const isPending = useMemo(() => isPostPending(post), [post]);

  const formattedDate = useFormatTimeForPostDetails(post.creationDate);
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
  }, [post, t]);

  // --- Child components --- //

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
  }, [isPending, isCurrentUserAuthor]);

  const ProfileInfo = React.useMemo(() => {
    return (
      <View style={styles.profileInfoView}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={onPressAuthor}>
          <FastImage source={authorProfilePic} style={styles.profilePic} />
          <View style={{ flexDirection: 'column' }}>
            <Typography.Subtitle2>{post.author.nickname}</Typography.Subtitle2>
            <View style={{ flexDirection: 'row' }}>
              <Typography.Body6 style={{ color: theme.colors.midGrey }}>
                @{post.author.dtag}
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
  }, [onPressAuthor, post, isPending, calculatedCreationDate, PendingIndicator]);

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
          <TouchableOpacity onPress={onPressComment} style={styles.commentButton}>
            <FastImage
              resizeMode="cover"
              tintColor={hasCommented ? theme.colors.butterOrange01 : theme.colors.grey02}
              source={hasCommented ? postCommentedIcon : postToCommentIcon}
              style={styles.bottomBarIcon}
            />
            <Typography.Subtitle3
              style={
                hasCommented
                  ? { color: theme.colors.butterOrange01 }
                  : { color: theme.colors.grey02 }
              }>
              {commentsCount}
            </Typography.Subtitle3>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onPressTip}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: theme.spacing.s,
          }}>
          <FastImage
            resizeMode="cover"
            source={hasTipped ? postTippedIcon : postToTipIcon}
            style={styles.bottomBarIcon}
          />
          <Typography.Subtitle3
            style={
              hasTipped ? { color: theme.colors.butterOrange01 } : { color: theme.colors.grey02 }
            }>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
    );
  }, [
    onPressLike,
    hasReacted,
    reactionsCount,
    onPressComment,
    hasCommented,
    commentsCount,
    onPressTip,
    hasTipped,
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
