import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {useGetPost} from '@recoil/selectedPost';
import appSettingsState from '@recoil/settings';
import {
  defaultProfilePic,
  followBlackIcon,
  moreBlackIcon,
  moreIcon,
} from 'assets/images';
import DView from 'components/DView';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import StickyBottomMenu from 'components/StickyBottomMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {utcToZonedTime} from 'date-fns-tz';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import InteractionSwitch from 'screens/PostDetails/components/InteractionSwitch';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import ReactionItem from 'screens/PostInteraction/PostReactions/components/ReactionItem';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import useHooks from './useHooks';
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
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [settings] = useRecoilState(appSettingsState);
  const {post, loading, refetchPost} = useGetPost(params.postId);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();

  const {DUMMY_COMMENTS, DUMMY_AUTHOR, textPostData} = useHooks();

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

  const renderItem = React.useCallback(
    ({item, index}: ListRenderItemInfo<any>) => {
      if (index === 0) {
        return (
          <InteractionSwitch
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            sections={[
              {sectionName: 'Comments', counter: 10},
              {sectionName: 'Reactions', counter: 5},
              {sectionName: 'Tips', counter: 0},
            ]}
          />
        );
      }
      if (selectedIndex === 0) {
        return (
          <CommentItem
            handlePressMore={() => {
              console.log('hello world');
            }}
            handlePressComment={() => {
              console.log('hello world');
            }}
            handlePressLike={() => {
              console.log('hello world');
            }}
            handlePressTip={() => {
              console.log('hello world');
            }}
            handlePress={() => {
              console.log('hello world');
            }}
            handleLongPress={event => {
              setAnchor({
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
              });
              setMenuVisible(true);
            }}
            {...item}
          />
        );
      } else if (selectedIndex === 1) {
        return (
          <ReactionItem
            nickname={item.nickname}
            dTag={item.dTag}
            avatar={item.avatar}
            handlePressFollow={() => {
              console.log('follow');
            }}
            handlePressUnfollow={() => {
              console.log('unfollow');
            }}
            followed={item.followed}
          />
        );
      } else {
        return (
          <TipItem
            tipAmount={item.tipAmount}
            avatar={item.avatar}
            nickname={item.nickname}
            dTag={item.dTag}
            timestamp={item.timestamp}
          />
        );
      }
    },
    [selectedIndex],
  );

  const handlePressComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: string}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return (
      <EmptyListComponent
        label="no comments"
        handleButtonPress={() => {
          handlePressComment({author: DUMMY_AUTHOR, postId: 'DUMMYID'});
        }}
        buttonLabel="comment"
      />
    );
  }, []);

  return !post || loading ? (
    <ActivityIndicator />
  ) : (
    <DView
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
      <FlatList
        scrollEnabled={true}
        refreshing={loading}
        onRefresh={refetchPost}
        ListHeaderComponent={<PostComponent postData={textPostData} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingBottom: theme.spacing.l,
          paddingHorizontal: theme.spacing.m,
          flexGrow: 1,
        }}
        data={[0 as any, ...DUMMY_COMMENTS]}
      />
      <StickyBottomMenu
        leftButtonAction={() => console.log('left')}
        middleButtonAction={() => console.log('middle')}
        rightButtonAction={() => console.log('right')}
      />
      <PopupMenu
        anchor={anchor}
        visible={menuVisible}
        closeMenu={() => setMenuVisible(false)}
        menuItems={[
          {label: 'test1', onPress: () => console.log('test'), icon: moreIcon},
          {label: 'test1', onPress: () => console.log('test'), icon: moreIcon},
          {label: 'test1', onPress: () => console.log('test'), icon: moreIcon},
        ]}
      />
    </DView>
  );
};

export default PostDetails;
