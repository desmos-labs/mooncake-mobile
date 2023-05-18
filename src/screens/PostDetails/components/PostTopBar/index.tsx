import React, { useEffect } from 'react';
import { View } from 'react-native';
import { isComment, Post } from 'types/posts';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import BackButton from 'components/BackButton';
import Spacer from 'components/Spacer';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { block, followBlackIcon, hidePost, reportIcon, unblock, unfollowBlackIcon } from 'assets/images';
import {
  useHandlePressBlockOrUnblock,
  useHandlePressFollowOrUnfollow,
} from 'screens/PostDetails/hooks';
import { useTheme } from 'native-base';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { useTranslation } from 'react-i18next';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import PopupMenu from 'components/PopupMenu';
import { useHandlePressReport } from 'screens/Home/hooks';
import useHidePost from 'hooks/posts/useHidePost';
import useIsBlocked from 'hooks/relationships/blocked/useIsBlocked';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
import useStyles from './useStyles';

interface Props {
  readonly post: Post;
  readonly onBackButtonPress: () => void;
  // This callback may not be necessary anymore as native-base menu does not require x,y anchors to be explicitly set
  // for positioning, but it may be useful to keep around in-case we want to do additional actions when opening the popup menu
  readonly handlePressMore?: () => void;
  // old implementation, for reference (marked for deletion)
  // readonly handlePressMore: (event: GestureResponderEvent) => void;
}

/**
 * Component that renders the top bar for the post details screen.
 * @param post - Post to render
 * @param handlePressMore - Handler for pressing the more button
 * @param onBackButtonPress - Handler for pressing the back button
 * @constructor
 */
const PostTopBar = ({ post, handlePressMore, onBackButtonPress }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------

  const formatDate = useFormatTimeForPostDetails();

  const { isFollowing, refetch: refreshFollowing } = useIsFollowing(post.author.address);
  const { isBlocked, refetch: refreshIsBlocked } = useIsBlocked(post.author.address);
  const { count: commentsCount } = usePostCommentsCount(post);
  const isAuthorActiveUser = useIsAuthorActiveUser(post.author.address);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollowOrUnfollow = useHandlePressFollowOrUnfollow();
  const handlePressReport = useHandlePressReport();
  const handlePressHidePost = useHidePost();
  const handlePressBlockOrUnblock = useHandlePressBlockOrUnblock();

  // -------------------------------------------------------------------------------------
  // --- Effects
  // -------------------------------------------------------------------------------------

  useEffect(() => {
    refreshFollowing();
    refreshIsBlocked();

    // It's safe to disable the linter here as we only want to run this effect once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------------------
  // --- Popup menu
  // -------------------------------------------------------------------------------------

  const PressMoreComponent = React.useMemo(() => {
    // Hide the context menu if the user is the author of the post
    if (isAuthorActiveUser) return undefined;

    const menuItems = [
      {
        label: isFollowing ? t('home:unfollow') : t('home:follow'),
        onPress: () => handlePressFollowOrUnfollow(post.author),
        icon: isFollowing ? unfollowBlackIcon : followBlackIcon,
      },
      {
        label: t('home:report'),
        onPress: () => handlePressReport(post),
        icon: reportIcon,
      },
      {
        label: t('home:hide'),
        onPress: async () => {
          await handlePressHidePost(post.id);

          // just reuse the default back button press behavior here and goBack one screen in the stack.
          onBackButtonPress();
        },
        icon: hidePost,
      },
      {
        label: isBlocked ? t('home:unblock') : t('home:block'),
        onPress: () => handlePressBlockOrUnblock(post.author),
        icon: isBlocked ? unblock : block,
      },
    ];

    return <PopupMenu menuItems={menuItems} onMenuOpen={handlePressMore} />;
  }, [
    isAuthorActiveUser,
    handlePressFollowOrUnfollow,
    handlePressBlockOrUnblock,
    handlePressHidePost,
    handlePressMore,
    handlePressReport,
    isBlocked,
    isFollowing,
    onBackButtonPress,
    post,
    t,
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
            <Typography.Subtitle3 numberOfLines={1}>
              {commentsCount} {t('replies')}
            </Typography.Subtitle3>
          </View>
        }
      />
    );
  }

  return (
    <View style={styles.customTopBarContainer}>
      <View style={styles.customTopBarInnerContainer}>
        <BackButton onPress={onBackButtonPress} />

        <Spacer paddingLeft={theme.spacing.m}>
          <View style={styles.rightContainer}>
            <ProfileHeaderButton
              profile={post!.author}
              onPress={() => handleNavigateToProfile(post!.author.address)}
            />
            <View style={styles.middleTextContainer}>
              <Typography.Subtitle3 numberOfLines={1}>
                {getProfileDisplayName(post!.author)}
              </Typography.Subtitle3>
              <Typography.Body7>{formatDate(post!.creationDate)}</Typography.Body7>
            </View>
          </View>
        </Spacer>
      </View>

      <View style={styles.rightContainer}>
        <Spacer paddingHorizontal="xs" />
        {PressMoreComponent}
      </View>
    </View>
  );
};

export default PostTopBar;
