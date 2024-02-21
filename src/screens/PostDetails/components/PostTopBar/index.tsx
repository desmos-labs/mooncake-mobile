import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { block, hidePost, reportIcon, unblock } from 'assets/images';
import PopupMenu from 'components/PopupMenu';
import { useHandlePressReport } from 'components/PostCard/hooks';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import ToggleFollowageButton from 'components/ToggleFollowageButton';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useHidePost from 'hooks/posts/useHidePost';
import useIsAuthorActiveUser from 'hooks/useIsAuthorActiveUser';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useHandlePressBlockOrUnblock } from 'screens/PostDetails/hooks';
import { Post } from 'types/posts';
import useStyles from './useStyles';

interface Props {
  readonly post: Post;
  readonly handlePressMore?: () => void;
}

/**
 * Component that renders the top bar for the post details screen.
 * @param post - Post to render
 * @param commentsCount - Number of comments of the post
 * @param handlePressMore - Handler for pressing the more button
 * @constructor
 */
const PostTopBar = ({ post, handlePressMore }: Props) => {
  const navigation = useNavigation();
  const styles = useStyles();
  const { t } = useTranslation('postDetails');

  // -------------------------------------------------------------------------------------
  // --- Hooks
  // -------------------------------------------------------------------------------------
  const [menuOpened, setMenuOpened] = useState(false);

  const isAuthorActiveUser = useIsAuthorActiveUser(post.author.address);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressReport = useHandlePressReport();
  const handlePressHidePost = useHidePost();
  const handlePressBlockOrUnblock = useHandlePressBlockOrUnblock();

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
        label: t('report', { ns: 'postOperations' }),
        onPress: () => handlePressReport(post),
        icon: reportIcon,
      },
      {
        label: t('hide', { ns: 'postOperations' }),
        onPress: async () => {
          await handlePressHidePost(post.id);

          // just reuse the default back button press behavior here and goBack one screen in the stack.
          navigation.goBack();
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
    t,
    post,
    handlePressReport,
    handlePressHidePost,
    handlePressBlockOrUnblock,
  ]);

  // -------------------------------------------------------------------------------------
  // --- View rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.customTopBarContainer}>
      <View style={styles.customTopBarInnerContainer}>
        <View style={styles.rightContainer}>
          <ProfileHeaderButton
            profile={post!.author}
            onPress={() => handleNavigateToProfile(post!.author.address)}
          />
          <View style={styles.middleTextContainer}>
            <Typography.Semibold14 numberOfLines={1}>
              {getProfileDisplayName(post!.author)}
            </Typography.Semibold14>
            <Typography.Regular12 style={styles.subtitle}>@{post.author.dTag}</Typography.Regular12>
          </View>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <ToggleFollowageButton user={post.author} buttonStyle={{ borderRadius: 8 }} />
        <Spacer paddingHorizontal="s" />
        {PressMoreComponent}
      </View>
    </View>
  );
};

export default PostTopBar;
