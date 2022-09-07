import Typography from 'components/Typography';
import React from 'react';
import {View} from 'react-native';
import useStyles from './useStyles';

/* type NavProps = MaterialTopTabScreenProps<
  RootNavigatorParamList,
  ROUTES.PROFILE_POSTS_POSTS
>; */

export type PostsTabParams = {
  userAddress: string;
};

export const PostsTab = () => {
  const styles = useStyles();

  return (
    <View style={styles.contentContainer}>
      <Typography.H1>test</Typography.H1>
    </View>
  );
};

export default PostsTab;
