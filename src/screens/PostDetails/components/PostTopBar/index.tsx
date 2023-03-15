import React from 'react';
import { GestureResponderEvent, View } from 'react-native';
import { isCommentReply, Post } from 'types/posts';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import BackButton from 'components/BackButton';
import Spacer from 'components/Spacer';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import ImageButton from 'components/ImageButton';
import { followBlackIcon, moreBlackIcon, unfollowBlackIcon } from 'assets/images';
import { useHandlePressFollowOrUnfollow } from 'screens/PostDetails/hooks';
import { useTheme } from 'react-native-paper';
import useFormatTimeForPostDetails from 'hooks/formatting/useFormatTimeForPostDetails';
import { useActiveAccountAddress } from '@recoil/accounts';
import usePostCommentsCount from 'hooks/posts/comments/usePostCommentsCount';
import { useTranslation } from 'react-i18next';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import useIsFollowing from 'hooks/relationships/useIsFollowing';
import useStyles from './useStyles';

interface Props {
  readonly post: Post;
  readonly handlePressMore: (event: GestureResponderEvent) => void;
  readonly onBackButtonPress: () => void;
  readonly addressToCheck: string;
}

/**
 * Component that renders the top bar for the post details screen.
 * @param post - Post to render
 * @param handlePressMore - Handler for pressing the more button
 * @param onBackButtonPress - Handler for pressing the back button
 * @param addressToCheck - Address to check if the user is following
 * @constructor
 */
const PostTopBar = ({ post, handlePressMore, onBackButtonPress, addressToCheck }: Props) => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  /**
   * Hooks for handling various actions
   */
  const handlePressFollowOrUnfollow = useHandlePressFollowOrUnfollow();
  const formatDate = useFormatTimeForPostDetails();
  const activeAddress = useActiveAccountAddress();
  const handleNavigateToProfile = useNavigateToProfile();
  const isFollowingAddress = useIsFollowing(addressToCheck);

  /**
   * Hooks for getting comments count
   */
  const { count: commentsCount } = usePostCommentsCount(post);

  if (isCommentReply(post!)) {
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
        {activeAddress !== post!.author.address && (
          <ImageButton
            style={[styles.followIcon]}
            image={isFollowingAddress ? unfollowBlackIcon : followBlackIcon}
            onPress={() => {
              handlePressFollowOrUnfollow(post!.author);
            }}
          />
        )}
        <ImageButton onPress={handlePressMore} style={styles.moreIcon} image={moreBlackIcon} />
      </View>
    </View>
  );
};

export default PostTopBar;
