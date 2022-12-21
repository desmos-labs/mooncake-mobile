import {emptyPostsIcon} from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
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
import {verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import useStyles from './useStyles';

interface Props {
  onPress: () => void;
  posts: any[];
  postsData: any[];
  postsLoading: boolean;
}

const PostsSection = ({onPress, postsData, postsLoading, posts}: Props) => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('profile');

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postsMargin={2}
      postsSize={104}
      postData={item}
      onPress={() => console.log('test')}
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
        style={{height: 80, width: 80, marginBottom: theme.spacing.s}}
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
        {posts.length !== 0 && !postsLoading && (
          <Typography.Body7 style={{color: theme.colors.midGrey}}>
            {t('created liked tipped')}
          </Typography.Body7>
        )}
      </Spacer>
      {postsData && !postsLoading ? (
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
            flexGrow: 1,
          }}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={posts}
          renderItem={renderPosts}
          ListEmptyComponent={emptyComponent}
        />
      ) : (
        <View style={{height: verticalScale(145), justifyContent: 'center'}}>
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
