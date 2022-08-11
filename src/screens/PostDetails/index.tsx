import DView from 'components/DView';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import React from 'react';
import {Text} from 'react-native';
import useStyles from './useStyles';

export interface PostDetailsParams {
  post: PostItem;
}

const PostDetails: React.FC<PostDetailsParams> = ({post}) => {
  const styles = useStyles();

  return (
    <>
      <DView scrollable style={styles.root} topBar={<TopBar />}>
        <Typography.H1>{post.id}</Typography.H1>
        <Typography.H1>PostDetails</Typography.H1>
        <Typography.H1>PostDetails</Typography.H1>
        <Typography.H1>PostDetails</Typography.H1>
        <Typography.H1>PostDetails</Typography.H1>
        <Typography.H1>PostDetails</Typography.H1>
        <Text>PostDetails</Text>
        <Text>PostDetails</Text>
        <Text>PostDetails</Text>
        <Text>PostDetails</Text>
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
