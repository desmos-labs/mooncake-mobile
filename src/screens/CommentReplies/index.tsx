import {useFocusEffect, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import activeProfileState from '@recoil/activeProfileState';
import {defaultProfilePic, followBlackIcon, reportIcon} from 'assets/images';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import PopupMenu from 'components/PopupMenu';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardEventName,
  ListRenderItemInfo,
  Platform,
  View,
} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import {useRecoilState} from 'recoil';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.COMMENT_REPLIES
>;

export type CommentRepliesParams = {
  postId: number;
  commentId: number;
  subspaceId: number;
};

const CommentReplies = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  const {params} = useRoute<NavProps['route']>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();
  const [profileData] = useRecoilState(activeProfileState);
  const [popupMenuParams, setPopupMenuParams] = useState<{
    postId: number;
    subspaceId: number;
  }>();

  const {
    mainComment,
    mainCommentLoading,
    comments,
    commentsLoading,
    reactions,
    reactionsLoading,
    commentReplyLoading,
    pageRefetch,
    handlePressCounters,
    handleExpandComment,
    handlePressSendTips,
    handleCommentReply,
    handleAddReaction,
    handlePressReport,
  } = useHooks({
    subspaceID: params.subspaceId,
    commentID: params.commentId,
  });
  const scrollViewRef = useRef<FlatList>(null);

  useFocusEffect(
    React.useCallback(() => {
      pageRefetch();
    }, [params]),
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.select({
        ios: 'keyboardWillShow',
        android: 'keyboardDidShow',
      }) as KeyboardEventName,
      () => {
        setTimeout(
          () => scrollViewRef?.current?.scrollToEnd({animated: true}),
          100,
        );
      },
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const likesImages: [] = useMemo(() => {
    return reactions.map((reaction: any) => {
      if (reaction.author.profile_pic) {
        return {uri: reaction.author.profile_pic};
      } else {
        return defaultProfilePic;
      }
    });
  }, [reactions]);

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label={t('no comments yet')} />;
  }, []);

  const MiddleElement = useMemo(
    () => (
      <View style={styles.rightContainer}>
        <Typography.Subtitle3 numberOfLines={1}>
          {comments?.length} {t('replies')}
        </Typography.Subtitle3>
      </View>
    ),
    [comments?.length],
  );

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <CommentItem
          liked={item?.post?.reactionPresence?.aggregate?.count > 0}
          repliesCounter={item.post.repliesCount.aggregate.count}
          loading={commentsLoading}
          disableInnerComment={true}
          handlePressMore={event => {
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setPopupMenuParams({
              postId: item.post.id,
              subspaceId: item.post.subspace_id,
            });
            setMenuVisible(true);
          }}
          handlePressComment={() => {
            console.log('hello world');
          }}
          handlePressLike={() => handleAddReaction(item.post.id)}
          handlePressTip={() => {
            console.log('hello world');
          }}
          handlePress={() => {
            console.log('hello world');
          }}
          handleLongPress={() => console.log('longPress')}
          {...item.post}
        />
      );
    },
    [comments],
  );

  const headerComponent = React.useMemo(() => {
    return (
      <>
        <CommentItem
          liked={mainComment?.reactionPresence?.aggregate?.count > 0}
          repliesCounter={mainComment?.repliesCount?.aggregate?.count}
          loading={mainCommentLoading}
          handlePressMore={event => {
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setPopupMenuParams({
              postId: mainComment.id,
              subspaceId: mainComment.subspace_id,
            });
            setMenuVisible(true);
          }}
          handlePressComment={() => {
            console.log('hello world');
          }}
          handlePressLike={() => handleAddReaction(mainComment.id)}
          handlePressTip={() => {
            console.log('hello world');
          }}
          handlePress={() => {
            console.log('hello world');
          }}
          handleLongPress={() => console.log('longPress')}
          {...mainComment}
        />
        <PostActionButtonsBar
          postLiked={mainComment?.reactionPresence?.aggregate?.count > 0}
          handleLikePress={() => handleAddReaction(mainComment.id)}
          handleCommentPress={() => {
            console.log('hello world');
          }}
          handleTipPress={() => handlePressSendTips()}
        />
        <Spacer paddingVertical={16}>
          <InteractionCountersBar
            loading={reactionsLoading}
            likesCounter={reactions.length}
            tipsCounter={0}
            handlePressCounters={() => handlePressCounters()}
            accountsHighlitedPics={likesImages}
          />
        </Spacer>
        <Divider style={styles.divider} />
        <Spacer paddingBottom={16} />
      </>
    );
  }, [mainComment, reactions, likesImages]);

  const flatListData = useMemo(() => {
    return comments;
  }, [comments]);

  return mainCommentLoading || commentsLoading || reactionsLoading ? (
    <ActivityIndicator />
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={<TopBar style={styles.topBar} centerElement={MiddleElement} />}>
      <FlatList
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={mainCommentLoading}
        onRefresh={() => pageRefetch()}
        keyExtractor={item => item.post.id}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={flatListData}
      />
      <EnterCommentBottomBar
        loading={commentReplyLoading}
        focusTextInput={false}
        profileImage={
          profileData?.profile_pic
            ? {uri: profileData?.profile_pic}
            : defaultProfilePic
        }
        onIconPress={() =>
          handleExpandComment({
            author: mainComment.author,
            postId: mainComment.id,
          })
        }
        handlePostComment={handleCommentReply}
      />
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
            onPress: () =>
              handlePressReport(
                popupMenuParams?.postId!,
                popupMenuParams?.subspaceId!,
              ),
            icon: reportIcon,
          },
        ]}
      />
    </DView>
  );
};

export default CommentReplies;
