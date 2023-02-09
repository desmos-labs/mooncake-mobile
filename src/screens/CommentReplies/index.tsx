import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useFocusEffect, useRoute } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import activeProfileState from '@recoil/activeProfileState';
import { isFollowingAddr } from '@recoil/following';
import { defaultProfilePic, followBlackIcon, reportIcon } from 'assets/images';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import PopupMenu from 'components/PopupMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import _ from 'lodash';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabsParamList } from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState, useRecoilValue } from 'recoil';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import useFocusTextInputOnNavigate from 'hooks/useFocusOnTextInputWithParams';
import { FlashList } from '@shopify/flash-list';
import { Post } from 'types/posts';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.COMMENT_REPLIES>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export type CommentRepliesParams = {
  /**
   * Main comment, the one displayed on top of the screen.
   */
  comment: Post;
  /**
   * focus the comment box when navigating to this screen
   */
  focusCommentBox?: boolean;
};

const CommentReplies = () => {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation('postDetails');
  const { params } = useRoute<NavProps['route']>();
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{ x: number; y: number }>();
  const [profileData] = useRecoilState(activeProfileState);
  const [popupMenuParams, setPopupMenuParams] = useState<{
    postId: number;
    subspaceId: number;
    authorAddress: string;
  }>();

  const isFollowingAddress = useRecoilValue(isFollowingAddr(popupMenuParams?.authorAddress || ''));

  const { followOrUnfollowUser } = useFollowOrUnfollowUser();

  const { textInputRef, focusTextInputRef } = useFocusTextInputOnNavigate();

  const {
    mainComment,
    mainCommentLoading,
    comments,
    commentsLoading,
    reactions,
    reactionsLoading,
    tips,
    tipsLoading,
    commentReplyLoading,
    pageRefetch,
    handlePressCounters,
    handleExpandComment,
    handlePressSendTips,
    handleCommentReply,
    handleAddReaction,
    handlePressReport,
    handleNavigateToProfile,
    scrollViewRef,
  } = useHooks({
    subspaceID: params.subspaceId,
    commentID: params.commentId,
  });

  useFocusEffect(
    React.useCallback(() => {
      pageRefetch();
    }, [pageRefetch]),
  );

  const countersImages = useMemo(() => {
    const reactionsImages = reactions.map((reaction: any) => {
      if (reaction.author.profile_pic) {
        return { uri: reaction.author.profile_pic };
      } else {
        return defaultProfilePic;
      }
    });
    const tipsImages = tips.map((tip: any) => {
      if (tip.sender.profile_pic) {
        return { uri: tip.sender.profile_pic };
      } else {
        return defaultProfilePic;
      }
    });
    return _.unionBy(reactionsImages, tipsImages, 'uri') as any[];
  }, [reactions, tips]);

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label={t('no comments yet')} />;
  }, [t]);

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
    ({ item }: any) => {
      const { isPending } = item;
      return (
        <CommentItem
          tipped={item?.tipPresence?.aggregate?.count > 0}
          liked={item?.reactionPresence?.aggregate?.count > 0}
          commented={item?.commentPresence?.aggregate?.count > 0}
          repliesCounter={item?.repliesCount?.aggregate?.count || 0}
          isPending={isPending}
          disableInnerComment={true}
          handlePressMore={event => {
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setPopupMenuParams({
              postId: item.id,
              subspaceId: item.subspace_id,
              authorAddress: item.author.address,
            });
            setMenuVisible(true);
          }}
          handlePressComment={() => {}}
          handleProfilePicPress={() => handleNavigateToProfile(item?.author_address)}
          handlePressLike={() => !isPending && handleAddReaction(item.id)}
          handlePressTip={() => !isPending && handlePressSendTips(item?.author?.address, item.id)}
          handleLongPress={() => console.log('longPress')}
          text={item.text}
          creation_date={item.creation_date}
          attachments={item.attachments}
          reactions={item.reactions}
          tips={item.tips}
          author={isPending ? profileData || ({} as any) : item.author}
        />
      );
    },
    [handleAddReaction, handlePressSendTips],
  );

  const headerComponent = React.useCallback(() => {
    return (
      <>
        <CommentItem
          commented={mainComment?.commentPresence?.aggregate?.count > 0}
          tipped={mainComment?.tipPresence?.aggregate?.count > 0}
          liked={mainComment?.reactionPresence?.aggregate?.count > 0}
          repliesCounter={comments.length}
          loading={mainCommentLoading}
          handlePressMore={event => {
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setPopupMenuParams({
              postId: mainComment.id,
              subspaceId: mainComment.subspace_id,
              authorAddress: mainComment?.author.address,
            });
            setMenuVisible(true);
          }}
          handlePressComment={focusTextInputRef}
          handlePressLike={() => handleAddReaction(mainComment.id)}
          handleProfilePicPress={() => handleNavigateToProfile(mainComment?.author?.address)}
          handlePressTip={() => handlePressSendTips(mainComment?.author?.address, mainComment?.id)}
          {...mainComment}
        />
        <Divider style={styles.divider} />
        <InteractionCountersBar
          loading={reactionsLoading && tipsLoading}
          likesCounter={reactions.length}
          tipsCounter={tips.length}
          handlePressCounters={handlePressCounters}
          accountsHighlightedPics={countersImages}
        />
        <Divider style={styles.divider} />
      </>
    );
  }, [
    mainComment,
    mainCommentLoading,
    reactionsLoading,
    tipsLoading,
    countersImages,
    handleAddReaction,
    handlePressSendTips,
    handlePressCounters,
  ]);

  return mainCommentLoading || commentsLoading || reactionsLoading ? (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator color={theme.colors.surfaceBlack} />
    </SafeAreaView>
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={<TopBar style={styles.topBar} centerElement={MiddleElement} />}>
      <FlashList
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={mainCommentLoading}
        onRefresh={pageRefetch}
        estimatedItemSize={167}
        ListHeaderComponent={headerComponent}
        ListEmptyComponent={ListEmptyComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={comments}
        keyboardDismissMode="on-drag"
      />
      <EnterCommentBottomBar
        textInputRef={textInputRef}
        loading={commentReplyLoading}
        profileImage={
          profileData?.profile_pic ? { uri: profileData?.profile_pic } : defaultProfilePic
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
            label: isFollowingAddress ? t('unfollow') : t('follow'),
            onPress: () => {
              if (popupMenuParams) {
                followOrUnfollowUser({
                  addrToFollow: popupMenuParams.authorAddress,
                });
              }
            },
            icon: followBlackIcon,
          },
          {
            label: t('report'),
            onPress: () =>
              handlePressReport(popupMenuParams?.postId!, popupMenuParams?.subspaceId!),
            icon: reportIcon,
          },
        ]}
      />
    </DView>
  );
};

export default CommentReplies;
