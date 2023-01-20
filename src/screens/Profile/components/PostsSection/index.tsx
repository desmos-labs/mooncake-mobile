import {useNavigation} from '@react-navigation/native';
import {emptyPostsIcon} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import ROUTES from 'navigation/routes';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import useStyles from './useStyles';

interface Props {
  onPress: () => void;
  posts: any[];
  postsData: any[];
  postsLoading: boolean;
  guestProfile?: boolean;
}

const PostsSection = ({
  onPress,
  postsData,
  postsLoading,
  posts,
  guestProfile,
}: Props) => {
  const theme = useTheme();
  const styles = useStyles();
  const {navigate} = useNavigation<any>();
  const {t} = useTranslation('profile');

  const handlePostPressed = React.useCallback(
    ({subspaceID, id}: {subspaceID: number; id: number}) => {
      navigate(ROUTES.POST_DETAILS, {
        subspaceID,
        postId: id,
        focusCommentBox: false,
      });
    },
    [],
  );

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postsMargin={2}
      postsSize={104}
      postData={item}
      onPress={() =>
        handlePostPressed({
          subspaceID: item.subspace_id,
          id: item.id,
        })
      }
    />
  );

  const emptyComponent = () => (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FastImage
        resizeMode="contain"
        source={emptyPostsIcon}
        style={styles.emptyImage}
      />
      <Typography.Body7 style={{color: theme.colors.midGrey}}>
        {t('no posts')}
      </Typography.Body7>
    </View>
  );

  return (
    <View style={styles.container}>
      <Typography.Subtitle2>{t('posts')}</Typography.Subtitle2>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        {posts.length !== 0 && !postsLoading && !guestProfile && (
          <Typography.Body7 style={{color: theme.colors.midGrey}}>
            {t('created liked tipped')}
          </Typography.Body7>
        )}
      </Spacer>
      {postsData && !postsLoading ? (
        <FlatList
          contentContainerStyle={styles.flatlistContainer}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={posts}
          renderItem={renderPosts}
          ListEmptyComponent={emptyComponent}
        />
      ) : (
        <View style={styles.activityIndicatorView}>
          <ActivityIndicator />
        </View>
      )}
      {posts.length !== 0 && !postsLoading && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Typography.Body6
            style={{
              marginRight: theme.spacing.s,
              color: theme.colors.butterOrange01,
            }}>
            {t('see more')}
          </Typography.Body6>
          <Icon
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
