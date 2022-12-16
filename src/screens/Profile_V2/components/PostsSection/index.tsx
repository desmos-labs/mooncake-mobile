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
import {useTheme} from 'react-native-paper';
import {verticalScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePostCard from 'screens/Profile/components/ProfilePostCard';
import useQueries from 'screens/Profile_V2/useQueries';
import useStyles from './useStyles';

const PostsSection = () => {
  const theme = useTheme();
  const styles = useStyles();
  const {t} = useTranslation('profile');
  const {posts, postsData, postsLoading} = useQueries();

  const renderPosts = ({item}: any) => (
    <ProfilePostCard
      postsMargin={2}
      postsSize={104}
      postData={item}
      onPress={() => console.log('test')}
    />
  );

  return (
    <View style={{flex: 1, paddingVertical: theme.spacing.m}}>
      <Typography.Subtitle2>{t('posts')}</Typography.Subtitle2>
      <Spacer paddingBottom={theme.spacing.m} paddingTop={theme.spacing.xs}>
        <Typography.Body7 style={{color: theme.colors.midGrey}}>
          {t('created liked tipped')}
        </Typography.Body7>
      </Spacer>
      {postsData && !postsLoading ? (
        <FlatList
          contentContainerStyle={{
            alignItems: 'center',
          }}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={posts}
          renderItem={renderPosts}
        />
      ) : (
        <View style={{height: verticalScale(145), justifyContent: 'center'}}>
          <ActivityIndicator />
        </View>
      )}
      <TouchableOpacity
        style={{
          marginTop: theme.spacing.m,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
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
    </View>
  );
};

export default PostsSection;
