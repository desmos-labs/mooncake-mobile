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
        edges={['top', 'right', 'left']}
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
          <PostComponent postData={post} />
          <View
            style={{
              backgroundColor: 'rgba(247, 248, 250, 1)',
              width: '100%',
              height: 6,
            }}
          />
        </View>
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
