import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  defaultProfilePic,
  followBlackIcon,
  followOrangeIcon,
  moreBlackIcon,
  reportIcon,
  shareBlackIcon,
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
import InteractionSwitch from 'screens/PostDetails/components/InteractionSwitch';
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
  subspaceID: number;
};

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = React.useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState<{
    x: number;
    y: number;
  }>();
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();
  const [mode, setMode] = React.useState<'view' | 'comment'>('view');

  const {
    post,
    postLoading,
    postRefetch,
    comments,
    commentsLoading,
    reactions,
    formattedDate,
  } = useHooks({
    id: params.postId,
    sId: params.subspaceID,
  });

  useEffect(() => {
    console.log('reactionsDEntroAlPostDetails', reactions);
  }, [reactions]);

  const flatListData = useMemo(() => {
    if (selectedIndex === 0) return comments;
    else if (selectedIndex === 1) return reactions;
    else return [];
  }, [selectedIndex, comments, reactions]);

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
          <Typography.Body7>{formattedDate}</Typography.Body7>
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
          onPress={event => {
            setProfileMenuAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setProfileMenuVisible(true);
          }}
          style={styles.moreIcon}
          image={moreBlackIcon}
        />
      </View>
    ),
    [],
  );

  const handlePressSelectedComment = React.useCallback(
    ({
      postId,
      commentId,
      subspaceId,
    }: {
      postId: number;
      commentId: number;
      subspaceId: number;
    }) => {
      navigate(ROUTES.COMMENT_REPLIES, {
        postId,
        commentId,
        subspaceId,
      });
    },
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
              {sectionName: t('comments'), counter: comments.length},
              {
                sectionName: t('reactions'),
                counter: reactions.length,
              },
              {sectionName: t('tips'), counter: 0},
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
            handlePress={() =>
              handlePressSelectedComment({
                postId: post.id,
                commentId: item.id,
                subspaceId: item.subspace_id,
              })
            }
            handleLongPress={event => {
              setAnchor({
                x: event.nativeEvent.pageX,
                y: event.nativeEvent.pageY,
              });
              setMenuVisible(true);
            }}
            loading={commentsLoading}
            {...item}
          />
        );
      } else if (selectedIndex === 1) {
        return (
          <ReactionItem
            reaction={item}
            handlePressFollow={() => {
              console.log('follow');
            }}
            handlePressUnfollow={() => {
              console.log('unfollow');
            }}
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
    [selectedIndex, comments, reactions],
  );

  const handleExpandComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: string}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  /*  const ListEmptyComponent = React.useMemo(() => {
    return (
      <EmptyListComponent
        label="no comments"
        handleButtonPress={() => {
          handlePressComment({author: post.author, postId: post.id});
        }}
        buttonLabel="comment"
      />
    );
  }, []); */

  return postLoading ? (
    <ActivityIndicator />
  ) : (
    <DView
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
        refreshing={postLoading}
        onRefresh={() =>
          postRefetch({ID: params.postId, subspaceID: params.subspaceID})
        }
        ListHeaderComponent={<PostComponent postData={post} />}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={[0 as any, ...flatListData]}
      />
      {mode === 'view' ? (
        <StickyBottomMenu
          leftButtonInteractions={comments.length}
          middleButtonInteractions={reactions.length}
          rightButtonInteractions={0}
          leftButtonAction={() => setMode('comment')}
          middleButtonAction={() => console.log('middle')}
          rightButtonAction={handlePressSendTips}
        />
      ) : (
        <EnterCommentBottomBar
          profileImage={
            post?.author.profile_pic
              ? {uri: post?.author.profile_pic}
              : defaultProfilePic
          }
          onIconPress={() =>
            handleExpandComment({author: post.author, postId: post.id})
          }
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
      <PopupMenu
        anchor={profileMenuAnchor}
        visible={profileMenuVisible}
        closeMenu={() => setProfileMenuVisible(false)}
        menuItems={[
          {
            label: t('share'),
            onPress: () => console.log('test'),
            icon: shareBlackIcon,
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
