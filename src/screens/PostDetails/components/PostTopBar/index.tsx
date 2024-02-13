import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import {
  block,
  followBlackIcon,
  hidePost,
  reportIcon,
  share,
  unblock,
  unfollowBlackIcon,
} from 'assets/images';
import BackButton from 'components/BackButton';
import PopupMenu from 'components/PopupMenu';
import { useHandlePressReport } from 'components/PostCard/hooks';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useHidePost from 'hooks/posts/useHidePost';
import useSharePost from 'hooks/posts/useSharePost';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  useHandlePressBlockOrUnblock,
  useHandlePressFollowOrUnfollow,
} from 'screens/PostDetails/hooks';
import { isComment, Post } from 'types/posts';
import useStyles from './useStyles';

interface Props {
  readonly post: Post;
  readonly commentsCount: number;
  readonly onBackButtonPress: () => void;
  readonly handlePressMore?: () => void;
}

/**
 * Component that renders the top bar for the post details screen.
 * @param post - Post to render
 * @param commentsCount - Number of comments of the post
 * @param handlePressMore - Handler for pressing the more button
 * @param onBackButtonPress - Handler for pressing the back button
 * @constructor
 */
const PostTopBar = ({ post, commentsCount, handlePressMore, onBackButtonPress }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('postDetails');

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------
  const [menuOpened, setMenuOpened] = useState(false);
  const formatDate = useFormatTimeForPostDetails();

  const isFollowing = useIsFollowing(post.author);
  const isAuthorActiveUser = useIsAuthorActiveUser(post.author.address);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollowOrUnfollow = useHandlePressFollowOrUnfollow();
  const handlePressReport = useHandlePressReport();
  const handlePressHidePost = useHidePost();
  const handlePressBlockOrUnblock = useHandlePressBlockOrUnblock();
  const sharePost = useSharePost(post.id);

  // -------------------------------------------------------------------------------------
  // --- Popup menu
  // -------------------------------------------------------------------------------------

  const onSetMenuOpened = useCallback(() => {
    setMenuOpened(prevState => !prevState);
    handlePressMore && handlePressMore();
  }, [handlePressMore]);

  const PressMoreComponent = React.useMemo(() => {
    // Hide the context menu if the user is the author of the post
    if (isAuthorActiveUser) {
      return undefined;
    }

    const menuItems = [
      {
        label: isFollowing
          ? t('unfollow', { ns: 'relationships' })
          : t('follow', { ns: 'relationships' }),
        onPress: () => handlePressFollowOrUnfollow(post.author),
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('share', { ns: 'postOperations' }),
        onPress: sharePost,
        icon: share,
      },
      {
        label: t('report', { ns: 'postOperations' }),
        onPress: () => handlePressReport(post),
        icon: reportIcon,
      },
      {
        label: t('hide', { ns: 'postOperations' }),
        onPress: async () => {
          await handlePressHidePost(post.id);

          // just reuse the default back button press behavior here and goBack one screen in the stack.
          onBackButtonPress();
        },
        icon: hidePost,
      },
      {
        label: post.author.isBlockedByUser
          ? t('unblock', { ns: 'relationships' })
          : t('block', { ns: 'relationships' }),
        onPress: () => handlePressBlockOrUnblock(post.author),
        icon: post.author.isBlockedByUser ? unblock : block,
      },
    ];

    return (
      <>
        <Entypo
          name="dots-three-horizontal"
          size={24}
          color="black"
          suppressHighlighting
          onPress={onSetMenuOpened}
        />
        <PopupMenu
          menuItems={menuItems}
          popupMenuOpened={menuOpened}
          setPopupMenuOpened={setMenuOpened}
        />
      </>
    );
  }, [
    onSetMenuOpened,
    menuOpened,
    setMenuOpened,
    isAuthorActiveUser,
    isFollowing,
    t,
    sharePost,
    handlePressFollowOrUnfollow,
    post,
    handlePressReport,
    handlePressHidePost,
    onBackButtonPress,
    handlePressBlockOrUnblock,
  ]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  if (isComment(post!)) {
    return (
      <TopBar
        style={styles.topBar}
        centerElement={
          <View style={styles.rightContainer}>
            <Typography.Semibold16 numberOfLines={1}>
              {commentsCount} {t('replies')}
            </Typography.Semibold16>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.customTopBarContainer}>
      <View style={styles.customTopBarInnerContainer}>
        <BackButton onPress={onBackButtonPress} />
        <Spacer paddingLeft={theme.spacings.m} />
        <View style={styles.rightContainer}>
          <ProfileHeaderButton
            profile={post!.author}
            onPress={() => handleNavigateToProfile(post!.author.address)}
          />
          <View style={styles.middleTextContainer}>
            <Typography.Semibold14 numberOfLines={1}>
              {getProfileDisplayName(post!.author)}
            </Typography.Semibold14>
            <Typography.Regular12 style={styles.subtitle}>
              {formatDate(post!.creationDate)}
            </Typography.Regular12>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <Spacer paddingHorizontal="xs" />
        {PressMoreComponent}
      </View>
    </View>
  );
};

export default PostTopBar;
