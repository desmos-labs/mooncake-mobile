import {useNavigation} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import DView from 'components/DView';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect} from 'react';
import {Text} from 'react-native';
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
  const {params} = useNavigation<NavProps['route']>();

  useEffect(() => {
    if (params) {
      console.log(params.postId);
    }
  }, []);

  return (
    <>
      <DView scrollable style={styles.root} topBar={<TopBar />}>
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
