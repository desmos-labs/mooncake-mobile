import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
import StyledSpinner from 'components/StyledSpinner';
import PostCard from 'screens/Home/components/PostCard';
import useNavigateToProfile from 'hooks/navigation/useNavigateToProfile';
import {
  useHandlePressComments,
  useHandlePressDetails,
  useHandlePressFollow,
  useHandlePressHidePost,
  useHandlePressReport,
  useHandlePressTip,
} from 'screens/Home/hooks';
import useStyles from './useStyles';

export interface PostsSectionProps {
  /**
   * Address of the profile related to the posts that will be displayed.
   */
  readonly address: string;
  /**
   * Posts to be displayed.
   */
  readonly posts: Post[];
  /**
   * Flag that indicates if the posts are being loaded.
   */
  readonly loading: boolean;
  /**
   * Action to be executed when the user presses this section.
   */
  readonly onPress: () => void;
}

/**
 * Component that renders the posts section.
 * @constructor
 */
const PostsSection = (props: PostsSectionProps) => {
  const { t } = useTranslation('profile');
  const theme = useTheme();
  const styles = useStyles();

  const { address, onPress, posts, loading: isLoading } = props;

  const activeAddress = useActiveAccountAddress();
  const isGuestProfile = useMemo(() => address === activeAddress, [activeAddress, address]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  const handleNavigateToProfile = useNavigateToProfile();
  const handlePressFollow = useHandlePressFollow();
  const handlePressDetails = useHandlePressDetails();
  const handlePressReport = useHandlePressReport();
  const handlePressComments = useHandlePressComments();
  const handlePressTip = useHandlePressTip();
  const handlePressHidePost = useHandlePressHidePost();

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Typography.Subtitle2>{t('posts')}</Typography.Subtitle2>

      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        {/* Subtitle of the section */}
        {posts.length !== 0 && !isLoading && !isGuestProfile && (
          <Typography.Body7 style={{ color: theme.colors.midGrey }}>
            {t('created liked tipped')}
          </Typography.Body7>
        )}
      </Spacer>

      {/* Posts list, or loading indicator */}
      {!isLoading ? (
        <PostCard
          post={posts[0]}
          onPressAuthor={() => handleNavigateToProfile(posts[0].author.address)}
          onPressReport={() => {
            handlePressReport(posts[0]);
          }}
          onPressFollow={() => handlePressFollow(posts[0].author)}
          onPressDetails={() => handlePressDetails(posts[0])}
          onPressComment={() => handlePressComments(posts[0])}
          onPressTip={() => handlePressTip(posts[0])}
          onPressHide={() => handlePressHidePost(posts[0].id)}
        />
      ) : (
        <View style={styles.activityIndicatorView}>
          <StyledSpinner />
        </View>
      )}

      {/* See more button */}
      {!isLoading && posts.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Typography.Body6
            style={{
              marginRight: theme.spacing.s,
              color: theme.colors.butterOrange01,
            }}>
            {t('see more')}
          </Typography.Body6>
          <Icon name="angle-right" color={theme.colors.butterOrange01} size={22} allowFontScaling />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostsSection;
