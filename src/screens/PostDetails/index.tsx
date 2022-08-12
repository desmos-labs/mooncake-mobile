import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useGetPost} from '@recoil/selectedPost';
import {defaultProfilePic, followBlackIcon, moreBlackIcon} from 'assets/images';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {useTheme} from 'react-native-paper';
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
  const theme = useTheme();
  const {params} = useRoute<NavProps['route']>();
  const {post, loading, refetchPost} = useGetPost(params.postId);

  useEffect(() => {
    if (!loading) {
      console.log(post);
    }
  }, [post]);

  const MiddleElement = useMemo(
    () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ProfileHeaderButton
          imageSrc={defaultProfilePic}
          onPress={() => console.log('press')}
        />
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: theme.spacing.s,
            minWidth: 160,
          }}>
          <Typography.Subtitle3 numberOfLines={1}>
            Ashlynn Siphron
          </Typography.Subtitle3>
          <Typography.Body7>18 Feb, 18:18</Typography.Body7>
        </View>
      </View>
    ),
    [],
  );

  const RightElement = useMemo(
    () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ImageButton
          onPress={() => console.log('follow')}
          style={{width: 37, height: 37, backgroundColor: 'red'}}
          image={followBlackIcon}
        />
        <ImageButton
          onPress={() => console.log('more')}
          style={{
            width: 24,
            height: 24,
            marginLeft: theme.spacing.s,
            backgroundColor: 'red',
          }}
          image={moreBlackIcon}
        />
      </View>
    ),
    [],
  );

  return post ? (
    <>
      <DView
        scrollable
        enableRefreshControl
        refreshing={loading}
        onRefresh={refetchPost}
        backgroundColor={theme.colors.white}
        edges={['top', 'right', 'left']}
        style={styles.root}
        topBar={
          <TopBar
            style={{backgroundColor: theme.colors.white}}
            centerElement={MiddleElement}
            rightElement={RightElement}
          />
        }>
        <Spacer paddingTop={10} />
        <View onStartShouldSetResponder={() => true} style={{flex: 1}}>
          <PostComponent postData={post} />
          <View
            style={{
              backgroundColor: 'rgba(247, 248, 250, 1)',
              width: '100%',
              height: 6,
            }}
          />
        </View>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
        <Typography.H1>Test</Typography.H1>
      </DView>
      <StickyBottomMenu
        leftButtonAction={() => console.log('left')}
        middleButtonAction={() => console.log('middle')}
        rightButtonAction={() => console.log('right')}
      />
    </>
  ) : (
    <ActivityIndicator />
  );
};

export default PostDetails;
