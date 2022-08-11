import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useGetPost} from '@recoil/selectedPost';
import DView from 'components/DView';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect} from 'react';
import {ScrollView, Text} from 'react-native';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_DETAILS
>;

export type PostDetailsParams = {
  postId: number;
};

const PostDetails = () => {
  const styles = useStyles();
  const {params} = useRoute<NavProps['route']>();
  const {post, loading, refetchPost} = useGetPost(params.postId);

  useEffect(() => {
    if (!loading) {
      console.log(post);
    }
  }, [post]);

  return (
    <>
      <DView
        scrollable
        enableRefreshControl
        refreshing={loading}
        onRefresh={refetchPost}
        style={styles.root}
        topBar={<TopBar />}>
        <ScrollView>
          <Typography.H1>{post?.id}</Typography.H1>
          <Typography.H1>{post?.text}</Typography.H1>
          <Typography.H1>PostDetails</Typography.H1>
          <Typography.H1>PostDetails</Typography.H1>
          <Text>PostDetails</Text>
          <Text>PostDetails</Text>
          <Text>PostDetails</Text>
          <Text>PostDetails</Text>
        </ScrollView>
      </DView>
      <StickyBottomMenu
        leftButtonAction={() => console.log('left')}
        middleButtonAction={() => console.log('middle')}
        rightButtonAction={() => console.log('right')}
      />
    </>
  );
};

export default PostDetails;
