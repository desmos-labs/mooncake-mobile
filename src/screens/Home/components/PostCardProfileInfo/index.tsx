import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { useActiveAccountAddress } from '@recoil/accounts';
import { squaresAnimation } from 'assets/animations';
import {
  block,
  followBlackIcon,
  hidePost,
  reportIcon,
  share,
  unblock,
  unfollowBlackIcon,
} from 'assets/images';
import PopupMenu from 'components/PopupMenu';
import ThemedLottieView from 'components/ThemedLottieView';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import useTimePassedDate from 'hooks/formatting/useTimePassedDate';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import { getProfilePicture } from 'lib/ProfileUtils';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { isPostPending, Post } from 'types/posts';
import useStyles from './useStyles';

interface PostCardProfileInfoProps {
  readonly post: Post;
  readonly onPressAuthor: () => void;
  readonly onPressFollow: () => void;
  readonly onPressReport: () => void;
  readonly onPressHide: () => void;
  readonly onPressBlock: () => void;
  readonly onPressShare?: () => void;
}

/**
 * Component that displays the profile info of a post.
 * @constructor
 */
const PostCardProfileInfo = (props: PostCardProfileInfoProps) => {
  const theme = useTheme();
  const styles = useStyles();
  const { t } = useTranslation('home');
  const [menuOpened, setMenuOpened] = useState(false);
  const {
    post,
    onPressAuthor,
    onPressFollow,
    onPressReport,
    onPressHide,
    onPressBlock,
    onPressShare,
  } = props;

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const activeAddress = useActiveAccountAddress();
  const timePassedDate = useTimePassedDate(post.creationDate);
  const isFollowing = useIsFollowing(post.author);

  // -------------------------------------------------------------------------------------
  // --- Memoized variables
  // -------------------------------------------------------------------------------------

  const isCurrentUserAuthor = useMemo(
    () => post.author.address === activeAddress,
    [post, activeAddress],
  );

  const isPending = useMemo(() => isPostPending(post), [post]);

  // TODO: Replace this with https://day.js.org/docs/en/display/from-now

  const popupMenuItems = useMemo(
    () => [
      {
        label: isFollowing
          ? t('unfollow', { ns: 'relationships' })
          : t('follow', { ns: 'relationships' }),
        onPress: onPressFollow,
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      onPressShare && {
        label: t('share', { ns: 'postOperations' }),
        onPress: onPressShare,
        icon: share,
      },
      {
        label: t('report', { ns: 'postOperations' }),
        onPress: onPressReport,
        icon: reportIcon,
      },
      {
        label: t('hide', { ns: 'postOperations' }),
        onPress: onPressHide,
        icon: hidePost,
      },
      {
        label: post.author.isBlockedByUser
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: onPressBlock,
        icon: post.author.isBlockedByUser ? unblock : block,
      },
    ],
    [
      isFollowing,
      t,
      onPressFollow,
      onPressShare,
      onPressReport,
      onPressHide,
      post.author.isBlockedByUser,
      onPressBlock,
    ],
  );

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  const PendingIndicator = useMemo(() => {
    if (isPending) {
      return <ThemedLottieView source={squaresAnimation} autoPlay style={styles.pendingIcon} />;
    } else if (!isCurrentUserAuthor) {
      return (
        <>
          <Entypo
            name="dots-three-horizontal"
            size={24}
            color="black"
            suppressHighlighting
            onPress={() => setMenuOpened(prev => !prev)}
          />
          <PopupMenu
            popupMenuOpened={menuOpened}
            setPopupMenuOpened={setMenuOpened}
            menuItems={popupMenuItems}
          />
        </>
      );
    }
  }, [popupMenuItems, isPending, isCurrentUserAuthor, styles.pendingIcon, menuOpened]);

  return (
    <View style={styles.profileInfoView}>
      <TouchableOpacity style={CommonStyles.flexDirection.row} onPress={onPressAuthor}>
        <Image
          source={getProfilePicture(post.author)}
          style={styles.profilePic}
          recyclingKey={post.author.address}
        />
        <View style={{ flexDirection: 'column' }}>
          <Typography.Semibold14>{post.author.nickname}</Typography.Semibold14>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Typography.Regular12 style={{ color: theme.colors.neutralVariants['700'] }}>
              @{post.author.dTag}
            </Typography.Regular12>
            <Typography.Regular12
              style={{
                color: theme.colors.neutralVariants['700'],
                marginLeft: theme.spacings.xs,
              }}>
              {!isPending && `· ${timePassedDate}`}
            </Typography.Regular12>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}>
        {PendingIndicator}
      </View>
    </View>
  );
};

export default PostCardProfileInfo;
