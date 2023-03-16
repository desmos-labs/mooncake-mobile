import { useNavigation } from '@react-navigation/native';
import { emptyPostsIcon } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import { Post } from 'types/posts';
import { useActiveAccountAddress } from '@recoil/accounts';
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
  const { navigate } = useNavigation<any>();

  const { address, onPress, posts, loading: isLoading } = props;

  const activeAddress = useActiveAccountAddress();
  const isGuestProfile = useMemo(() => address === activeAddress, [activeAddress, address]);

  // -------------------------------------------------------------------------------------
  // --- Actions
  // -------------------------------------------------------------------------------------

  // Callback used to navigate to the post details screen
  const handlePostPressed = React.useCallback(
    (post: Post) => {
      navigate(ROUTES.POST_DETAILS, {
        subspaceId: post.subspaceId,
        postId: post.id,
        focusCommentBox: false,
      });
    },
    [navigate],
  );

  // -------------------------------------------------------------------------------------
  // --- Child components
  // -------------------------------------------------------------------------------------

  // Callback used to render a post within the list
  const renderPost = useCallback(
    ({ item }: ListRenderItemInfo<Post>) => (
      <ProfilePostCard
        post={item}
        postsMargin={2}
        postsSize={104}
        onPress={() => handlePostPressed(item)}
      />
    ),
    [handlePostPressed],
  );

  // Component to be rendered when the list is empty
  const EmptyComponent = useMemo(
    () => (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <FastImage resizeMode="contain" source={emptyPostsIcon} style={styles.emptyImage} />
        <Typography.Body7 style={{ color: theme.colors.midGrey }}>{t('no posts')}</Typography.Body7>
      </View>
    ),
    [styles.emptyImage, t, theme.colors.midGrey],
  );

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
        <FlatList
          contentContainerStyle={styles.tweetsListContainer}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={posts}
          renderItem={renderPost}
          ListEmptyComponent={EmptyComponent}
        />
      ) : (
        <View style={styles.activityIndicatorView}>
          <ActivityIndicator color={theme.colors.surfaceBlack} />
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
