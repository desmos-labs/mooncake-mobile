import {isFollowingAddr} from '@recoil/following';
import {loadingOrange} from 'assets/animations';
import {
  commentIcon,
  commentIconCommented,
  commentLiked,
  commentLikeEmptyIcon,
  defaultProfilePic,
  followBlackIcon,
  homeTipIcon,
  moreBlackIcon,
  reportIcon,
  unfollowBlackIcon,
} from 'assets/images';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import ThemedLottieView from 'components/ThemedLottieView';
import Typography from 'components/Typography';
import useRenderMediaAttachment from 'hooks/rendering/useRenderMediaAttachment';
import useActiveAccount from 'hooks/useActiveAccount';
import React, {useMemo, useState} from 'react';
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
    | 'reactions'
    | 'repliesCount'
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
  id,
  reactionPresence,
  commentPresence,
  reactions,
  repliesCount,
}: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('home');
  const {activeAddress, profileData} = useActiveAccount();

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
  }, [isPending, profileData]);

  const isFollowing = useRecoilValue(isFollowingAddr(authorData?.address));

  const {MediaAttachment} = useRenderMediaAttachment({
    attachments,
    useAutoSize: true,
    horizontalPaddingWithAutoSize: 32,
    imageStyle: {borderRadius: 10},
  });

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return (
        <ThemedLottieView
          source={loadingOrange}
          autoPlay
          style={{
            width: 30,
            height: 30,
            position: 'absolute',
            top: 2,
            left: 'auto',
            right: 0,
          }}
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
  }, [authorData, activeAddress, isPending, setMenuVisible, setMenuAnchor]);

  const ProfileInfo = React.useMemo(() => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.s,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={onPressAuthor}>
          <FastImage
            source={
              (authorData?.profile_pic && {uri: authorData?.profile_pic}) ||
              defaultProfilePic
            }
            style={{
              height: 48,
              width: 48,
              alignSelf: 'center',
              borderRadius: 24,
              marginRight: theme.spacing.s,
            }}
          />
          <View style={{flexDirection: 'column'}}>
            <Typography.Subtitle2>{authorData?.nickname}</Typography.Subtitle2>
            <Typography.Body6 style={{color: theme.colors.midGrey}}>
              @{authorData?.dtag}
            </Typography.Body6>
          </View>
        </TouchableOpacity>
        {PendingIndicator}
      </View>
    );
  }, [authorData?.profile_pic]);

  const BottomBar = React.useMemo(() => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: theme.spacing.m,
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <ImageButton
            onPress={onPressLike}
            tintColor={theme.colors.grey02}
            image={
              reactionPresence?.aggregate?.count >= 1
                ? commentLiked
                : commentLikeEmptyIcon
            }
            style={{height: 24, width: 24, marginRight: theme.spacing.xs}}
          />
          <Typography.Subtitle3 style={{color: theme.colors.grey02}}>
            {reactions?.length}
          </Typography.Subtitle3>
          <TouchableOpacity
            onPress={onPressComment}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: theme.spacing.s,
              marginLeft: theme.spacing.l,
            }}>
            <FastImage
              tintColor={theme.colors.grey02}
              source={
                commentPresence?.aggregate?.count >= 1
                  ? commentIconCommented
                  : commentIcon
              }
              style={{height: 24, width: 24, marginRight: theme.spacing.xs}}
            />
            <Typography.Subtitle3 style={{color: theme.colors.grey02}}>
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
            tintColor={theme.colors.grey02}
            source={homeTipIcon}
            style={{height: 22, width: 22, marginRight: theme.spacing.xs}}
          />
          <Typography.Subtitle3 style={{color: theme.colors.grey02}}>
            {t('tip')}
          </Typography.Subtitle3>
        </TouchableOpacity>
      </View>
    );
  }, [
    commentPresence,
    reactionPresence,
    onPressComment,
    onPressTip,
    onPressLike,
  ]);

  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPressDetails}>
      {ProfileInfo}
      <Typography.Body6 style={{marginVertical: theme.spacing.xs}}>
        {text}
      </Typography.Body6>
      {MediaAttachment && (
        <View style={{flex: 1, alignItems: 'center'}}>{MediaAttachment}</View>
      )}
      {BottomBar}
      <PopupMenu
        anchor={menuAnchor}
        visible={menuVisible}
        closeMenu={() => setMenuVisible(false)}
        menuItems={[
          {
            label: t('follow'),
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

export default PostCard;
