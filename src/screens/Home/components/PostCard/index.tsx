import {isFollowingAddr} from '@recoil/following';
import {loadingOrange} from 'assets/animations';
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
import {parseISO} from 'date-fns';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useActiveAccount from 'hooks/useActiveAccount';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import {formatMsToHumanReadable} from 'lib/FormatUtils';
import React, {memo, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import {useRecoilValue} from 'recoil';
import useStyles from './useStyles';

interface Props
  extends Pick<
    PostItem,
    | 'author'
    | 'isPending'
    | 'attachments'
    | 'text'
    | 'id'
    | 'commentPresence'
    | 'reactionPresence'
    | 'tipPresence'
    | 'reactions'
    | 'repliesCount'
    | 'creation_date'
  > {
  /**
   * What to do when the author's avatar, name, or dtag is pressed.
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

// The post dimensions are controlled by the Carousel
const PostCard = ({
  onPressAuthor,
  onPressFollow,
  onPressReport,
  onPressLike,
  onPressComment,
  onPressTip,
  onPressDetails,
  author,
  isPending,
  attachments,
  text,
  creation_date,
  reactionPresence,
  commentPresence,
  tipPresence,
  reactions,
  repliesCount,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('home');
  const {activeAddress, profileData} = useActiveAccount();
  const formattedDate = useFormatTimeForPostDetails(creation_date);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();

  // Use the current active user's profile data if the post is pending
  const authorData = React.useMemo(() => {
    if (isPending) {
      return profileData || ({} as any);
    } else return author;
  }, [author, isPending, profileData]);

  const isFollowing = useRecoilValue(isFollowingAddr(authorData?.address));

  const {MediaAttachment} = useRenderMediaAttachment({
    attachments,
    useAutoSize: true,
    horizontalPaddingWithAutoSize: 32,
    imageStyle: {borderRadius: 10, backgroundColor: theme.colors.background},
    resizeMode: 'contain',
  });

  const calculatedCreationDate = useMemo(() => {
    const parsedTime = parseISO(`${creation_date}Z`);
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
  }, [creation_date, formattedDate]);

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return (
        <ThemedLottieView
          source={loadingOrange}
          autoPlay
          style={styles.pendingIcon}
        />
      );
    } else if (activeAddress !== authorData?.address) {
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
          style={{width: 20, height: 20}}
        />
      );
    }
  }, [isPending, activeAddress, authorData?.address]);

  const ProfileInfo = React.useMemo(() => {
    return (
      <View style={styles.profileInfoView}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={onPressAuthor}>
          <FastImage
            source={
              (authorData?.profile_pic && {uri: authorData?.profile_pic}) ||
              defaultProfilePic
            }
            style={styles.profilePic}
          />
          <View style={{flexDirection: 'column'}}>
            <Typography.Subtitle2>{authorData?.nickname}</Typography.Subtitle2>
            <View style={{flexDirection: 'row'}}>
              <Typography.Body6 style={{color: theme.colors.midGrey}}>
                @{authorData?.dtag}
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
    onPressAuthor,
    authorData?.profile_pic,
    authorData?.nickname,
    authorData?.dtag,
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
            tintColor={
              reactionPresence?.aggregate?.count >= 1
                ? theme.colors.butterOrange01
                : theme.colors.grey02
            }
            image={
              reactionPresence?.aggregate?.count >= 1
                ? postLikedIcon
                : postToLikeIcon
            }
            style={styles.bottomBarIcon}
          />
          <Typography.Subtitle3
            style={
              reactionPresence?.aggregate?.count >= 1
                ? {color: theme.colors.butterOrange01}
                : {color: theme.colors.grey02}
            }>
            {reactions?.length}
          </Typography.Subtitle3>
          <TouchableOpacity
            onPress={onPressComment}
            style={styles.commentButton}>
            <FastImage
              resizeMode="cover"
              tintColor={
                commentPresence?.aggregate?.count >= 1
                  ? theme.colors.butterOrange01
                  : theme.colors.grey02
              }
              source={
                commentPresence?.aggregate?.count >= 1
                  ? postCommentedIcon
                  : postToCommentIcon
              }
              style={styles.bottomBarIcon}
            />
            <Typography.Subtitle3
              style={
                commentPresence?.aggregate?.count >= 1
                  ? {color: theme.colors.butterOrange01}
                  : {color: theme.colors.grey02}
              }>
              {repliesCount?.aggregate?.count}
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
            source={
              tipPresence?.aggregate?.count >= 1
                ? postTippedIcon
                : postToTipIcon
            }
            style={styles.bottomBarIcon}
          />
          <Typography.Subtitle3
            style={
              tipPresence?.aggregate?.count >= 1
                ? {color: theme.colors.butterOrange01}
                : {color: theme.colors.grey02}
            }>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
    );
  }, [
    onPressLike,
    reactionPresence?.aggregate?.count,
    reactions?.length,
    onPressComment,
    commentPresence?.aggregate?.count,
    repliesCount?.aggregate?.count,
    onPressTip,
    tipPresence?.aggregate?.count,
  ]);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPressDetails}>
      {ProfileInfo}
      {text && (
        <Typography.Body6 style={{marginTop: theme.spacing.m}}>
          {text}
        </Typography.Body6>
      )}
      {MediaAttachment && (
        <View style={styles.mediaView}>{MediaAttachment}</View>
      )}
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
