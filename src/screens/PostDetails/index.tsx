import {useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useGetPost} from '@recoil/selectedPost';
import appSettingsState from '@recoil/settings';
import {defaultProfilePic, followBlackIcon, moreBlackIcon} from 'assets/images';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import {utcToZonedTime} from 'date-fns-tz';
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
  const [settings] = useRecoilState(appSettingsState);
  const {post, loading, refetchPost} = useGetPost(params.postId);

  useEffect(() => {
    if (!loading) {
      console.log(post);
    }
  }, [post]);

  const formattedDate = useMemo(
    () => utcToZonedTime(post?.creation_date!, settings.currentTimezone),
    [post],
  );

  const Avatar = React.useMemo(() => {
    if (post?.author.profile_pic) {
      return <ProfileHeaderButton imageSrc={{uri: post.author.profile_pic}} />;
    }
    return <ProfileHeaderButton imageSrc={defaultProfilePic} />;
  }, [post?.author.profile_pic]);

  const MiddleElement = useMemo(
    () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {Avatar}
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            marginLeft: theme.spacing.s,
            minWidth: 160,
          }}>
          <Typography.Subtitle3 numberOfLines={1}>
            {post?.author.nickname || `@${post?.author.dtag}`}
          </Typography.Subtitle3>
          {/* temporary */}
          <Typography.Body7>{formattedDate.toDateString()}</Typography.Body7>
        </View>
      </View>
    ),
    [post],
  );

  const RightElement = useMemo(
    () => (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <ImageButton
          style={{
            zIndex: 1,
            width: 36,
            height: 36,
            tintColor: theme.colors.white,
          }}
          overlayComponent={
            <LinearGradient
              style={{
                flex: 1,
                ...StyleSheet.absoluteFillObject,
                borderRadius: 36,
              }}
              colors={theme.colors.dOrangeGradient01}
            />
          }
          image={followBlackIcon}
          onPress={() => console.log('add')}
        />
        <ImageButton
          onPress={() => console.log('more')}
          style={{
            width: 24,
            height: 24,
            marginLeft: theme.spacing.m,
          }}
          image={moreBlackIcon}
        />
      </View>
    ),
    [],
  );

  const textPostData: PostItem = {
    creation_date: '2022-06-30T17:06:47.475817',
    author_address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
    attachments: [],
    author: {
      address: 'desmos1ha4f852205lgsntq579x74ndfnqacy8z9uqqqa',
      bio: '',
      dtag: 'Donatello',
      profile_pic: 'https://i.imgur.com/aih9snA.png',
      nickname: 'Nickname',
    },
    subspace_id: 5,
    reactions: [],
    text: "I'm a ninja turtle that is a teenager. I'm a ninja turtle that is a teenager. ",
    conversation: null,
    id: 3,
  };

  const imagePostData: PostItem = {
    ...textPostData,
    attachments: [
      {
        id: 1,
        content: {
          uri: 'https://img.freepik.com/free-vector/colorful-palm-silhouettes-background_23-2148541792.jpg?w=1480&t=st=1660739347~exp=1660739947~hmac=a5b2dafae9c087fb414785c0bbf1f253147fe07756b2289aedae4478fb8ef231',
          '@type': '/desmos.posts.v1.Media',
          mime_type: 'image/png',
        },
      },
    ],
  };

  return !post || loading ? (
    <ActivityIndicator />
  ) : (
    <>
      <DView
        scrollable
        enableRefreshControl
        refreshing={loading}
        onRefresh={refetchPost}
        backgroundColor={theme.colors.white}
        edges={['top']}
        style={styles.root}
        topBar={
          <TopBar
            style={{
              backgroundColor: theme.colors.white,
              zIndex: 2,
              paddingBottom: 10,
            }}
            centerElement={MiddleElement}
            rightElement={RightElement}
          />
        }>
        <View onStartShouldSetResponder={() => true} style={{flex: 1}}>
          <PostComponent postData={imagePostData} />
        </View>
        <Typography.H3>INTERACTION COMPONENT</Typography.H3>
        <Typography.H3>INTERACTION COMPONENT</Typography.H3>
        <Typography.H3>INTERACTION COMPONENT</Typography.H3>
        <Typography.H3>INTERACTION COMPONENT</Typography.H3>
        <Typography.H3>INTERACTION COMPONENT</Typography.H3>
        {/* Interaction component */}
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
