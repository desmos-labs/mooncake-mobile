import Typography from '@desmoslabs/desmos-kit-ui/components/Typography';
import { FontAwesome } from '@expo/vector-icons';
import { useActiveAccountAddress } from '@recoil/accounts';
import { emptyPostsIcon } from 'assets/images';
import PostCard from 'components/PostCard';
import Spacer from 'components/Spacer';
import StyledSpinner from 'components/StyledSpinner';
import { Image } from 'expo-image';
import { Center, useTheme } from 'native-base';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Post } from 'types/posts';
import useStyles from './useStyles';

interface PostsSectionProps {
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

  const Content = useMemo(() => {
    if (posts.length === 0) {
      return (
        <Center flex={1}>
          <Image contentFit="contain" source={emptyPostsIcon} style={styles.emptyImage} />
          <Typography.Regular12 style={{ color: theme.colors.midGrey }}>
            {t('no posts')}
          </Typography.Regular12>
        </Center>
      );
    }

    return <PostCard post={posts[0]} />;
  }, [posts, styles.emptyImage, t, theme.colors.midGrey]);

  // -------------------------------------------------------------------------------------
  // --- Screen rendering
  // -------------------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      <Typography.Semibold16>{t('posts')}</Typography.Semibold16>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        {/* Subtitle of the section */}
        {posts.length !== 0 && !isLoading && !isGuestProfile && (
          <Typography.Regular12 style={{ color: theme.colors.midGrey }}>
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
              marginRight: theme.spacing.s,
              color: theme.colors.butterOrange01,
            }}>
            {t('see more')}
          </Typography.Regular14>
          <FontAwesome
            name="angle-right"
            color={theme.colors.butterOrange01}
            size={22}
            allowFontScaling
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PostsSection;
