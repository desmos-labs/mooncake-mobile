import {useQuery} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import appSettingsState from '@recoil/settings';
import {
  defaultProfilePic,
  followBlackIcon,
  followOrangeIcon,
  moreBlackIcon,
  reportIcon,
} from 'assets/images';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
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
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import InteractionSwitch from 'screens/PostDetails/components/InteractionSwitch';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import ReactionItem from 'screens/PostInteraction/PostReactions/components/ReactionItem';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_DETAILS
>;

export type PostDetailsParams = {
  postId: number;
  subspaceID: number;
};

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [settings] = useRecoilState(appSettingsState);
  const {data, loading, refetch} = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: params.postId,
      subspaceID: params.subspaceID,
    },
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();
  const [mode, setMode] = React.useState<'view' | 'comment'>('view');

  const {DUMMY_COMMENTS, DUMMY_AUTHOR, textPostData} = useHooks();

  const post = React.useMemo(() => {
    if (!data) return undefined;

    return data.posts[0];
  }, [data]);

  useEffect(() => {
    if (!loading) {
      console.log(post);
    }
  }, [post]);

  const formattedDate = useMemo(
    () => utcToZonedTime(post?.creation_date, settings.currentTimezone),
    [post],
  );

  const Avatar = React.useMemo(() => {
    if (post?.author.profile_pic) {
      return <ProfileHeaderButton imageSrc={{uri: post?.author.profile_pic}} />;
    }
    return <ProfileHeaderButton imageSrc={defaultProfilePic} />;
  }, [post?.author.profile_pic]);

  const MiddleElement = useMemo(
    () => (
      <View style={styles.rightContainer}>
        {Avatar}
        <View style={styles.middleTextContainer}>
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
      <View style={styles.rightContainer}>
        <ImageButton
          style={styles.followIcon}
          image={followOrangeIcon}
          onPress={() => console.log('add')}
        />
        <ImageButton
          onPress={() => console.log('more')}
          style={styles.moreIcon}
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
              {sectionName: t('comments'), counter: 1000},
              {sectionName: t('reactions'), counter: 5670},
              {sectionName: t('tips'), counter: 507},
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
      console.log('press enter comment');
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

  return loading ? (
    <ActivityIndicator />
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={
        <TopBar
          style={styles.topBar}
          centerElement={MiddleElement}
          rightElement={RightElement}
        />
      }>
      <FlatList
        scrollEnabled={true}
        refreshing={loading}
        onRefresh={() =>
          refetch({ID: params.postId, subspaceID: params.subspaceID})
        }
        ListHeaderComponent={<PostComponent postData={textPostData} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => item.id}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={[0 as any, ...DUMMY_COMMENTS]}
      />
      {mode === 'view' ? (
        <StickyBottomMenu
          leftButtonAction={() => setMode('comment')}
          middleButtonAction={() => console.log('middle')}
          rightButtonAction={() => console.log('right')}
        />
      ) : (
        <EnterCommentBottomBar
          profileImage={{uri: post?.author.profile_pic}}
          onIconPress={() => handlePressComment}
        />
      )}

      <PopupMenu
        anchor={anchor}
        visible={menuVisible}
        closeMenu={() => setMenuVisible(false)}
        menuItems={[
          {
            label: t('follow'),
            onPress: () => console.log('test'),
            icon: followBlackIcon,
          },
          {
            label: t('report'),
            onPress: () => console.log('test'),
            icon: reportIcon,
          },
        ]}
      />
    </DView>
  );
};

export default PostDetails;
