import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { emptyPostsIcon } from 'assets/images';
import PostCard from 'components/PostCard';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import CommonStyles from 'config/theme/CommonStyles';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Post } from 'types/posts';
import useStyles from './useStyles';

interface PostsSectionProps {
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

  const { onPress, posts, loading: isLoading } = props;

  const Content = useMemo(() => {
    if (posts.length === 0) {
      return (
        <View style={[CommonStyles.flex['1'], CommonStyles.center]}>
          <Image contentFit="contain" source={emptyPostsIcon} style={styles.emptyImage} />
          <Typography.Regular12 style={{ color: theme.colors.neutralVariants['600'] }}>
            {t('no posts')}
          </Typography.Regular12>
        </View>
      );
    }

    return posts.map(post => <PostCard post={post} key={post.externalId} />);
  }, [posts, styles.emptyImage, t, theme.colors.neutralVariants['600']]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Typography.Semibold16>{t('posts')}</Typography.Semibold16>
      <Spacer paddingBottom={theme.spacings.m} paddingTop={theme.spacings.xs}>
        {/* Subtitle of the section */}
        {posts.length !== 0 && !isLoading && (
          <Typography.Regular12 style={{ color: theme.colors.neutralVariants['600'] }}>
            {t('created liked tipped')}
          </Typography.Regular12>
        )}
      </Spacer>
      {/* Posts list, or loading indicator */}
      {!isLoading ? (
        Content
      ) : (
        <View style={styles.activityIndicatorView}>
          <StyledSpinner />
        </View>
      )}
      {/* See more button */}
      {!isLoading && posts.length > 0 && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Typography.Regular14
            style={{
              marginRight: theme.spacings.s,
              color: theme.colors.primary,
            }}>
            {t('see more')}
          </Typography.Regular14>
          <FontAwesome name="angle-right" color={theme.colors.primary} size={22} allowFontScaling />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostsSection;
