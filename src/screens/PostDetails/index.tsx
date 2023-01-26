import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import activeProfileState from '@recoil/activeProfileState';
import {isFollowingAddr} from '@recoil/following';
import {
  defaultProfilePic,
  followBlackIcon,
  moreBlackIcon,
  reportIcon,
  shareBlackIcon,
  unfollowBlackIcon,
} from 'assets/images';
import BackButton from 'components/BackButton';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import useActiveAccount from 'hooks/useActiveAccount';
import _ from 'lodash';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import {BottomTabsParamList} from 'navigation/RootNavigator/BottomTabs';
import ROUTES from 'navigation/routes';
import React, {useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Dimensions, View} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import {useRecoilState, useRecoilValue} from 'recoil';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/useFollowOrUnfollow';
import {FlashList} from '@shopify/flash-list';
import useFocusTextInputOnNavigate from 'hooks/useFocusOnTextInputWithParams';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList, ROUTES.POST_DETAILS>,
  BottomTabScreenProps<BottomTabsParamList>
>;

export type PostDetailsParams = {
  /**
   * id of the post
   */
  postId: number;
  /**
   * susbpace_id of the post
   */
  subspaceId: number;
  /**
   * focus the comment box when navigating to this screen
   */
  focusCommentBox?: boolean;
};

const PostDetails = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  const {params} = useRoute<NavProps['route']>();
  const {goBack} = useNavigation<NavProps['navigation']>();
  const [profileData] = useRecoilState(activeProfileState);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();
  const [anchor, setAnchor] = useState<{x: number; y: number}>();
  const [popupMenuParams, setPopupMenuParams] = useState<{
    postId: number;
    subspaceId: number;
    authorAddress: string;
  }>();
  const {activeAddress} = useActiveAccount();
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();
  const scrollViewRef = useRef<any>(null);

  const {textInputRef, focusTextInputRef} = useFocusTextInputOnNavigate();

  const {
    profile,
    post,
    postLoading,
    comments,
    reactions,
    reactionsLoading,
    tips,
    tipsLoading,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressCounters,
    handlePressSendTips,
    handlePostComment,
    handleAddReaction,
    postCommentLoading,
    handlePressReport,
    handleNavigateToProfile,
    pageRefetch,
  } = useHooks({
    postID: params.postId,
    subspaceID: params.subspaceId,
  });

  const isFollowingAddress = useRecoilValue(
    isFollowingAddr(popupMenuParams?.authorAddress || ''),
  );

  const {top} = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      setPopupMenuParams({
        postId: post.id,
        subspaceId: post.subspace_id,
        authorAddress: post?.author?.address,
      });
      pageRefetch();
    }, [post.id, post.subspace_id, post?.author?.address, pageRefetch]),
  );

  const Avatar = React.useMemo(() => {
    if (post?.author?.profile_pic) {
      return (
        <ProfileHeaderButton
          imageSrc={{uri: post?.author.profile_pic}}
          onPress={() => handleNavigateToProfile(post?.author?.address)}
        />
      );
    }
    return (
      <ProfileHeaderButton
        imageSrc={defaultProfilePic}
        onPress={() => handleNavigateToProfile(post?.author?.address)}
      />
    );
  }, [
    post?.author?.profile_pic,
    post?.author?.address,
    handleNavigateToProfile,
  ]);

  const renderItem = React.useCallback(
    ({item}: any) => {
      const {isPending} = item;

      return (
        <CommentItem
          tipped={item?.tipPresence?.aggregate?.count > 0}
          liked={item?.reactionPresence?.aggregate?.count > 0}
          commented={item?.commentPresence?.aggregate?.count > 0}
          repliesCounter={item?.repliesCount?.aggregate?.count || 0}
          handlePressMore={event => {
            if (isPending) return;
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setMenuVisible(true);
            setPopupMenuParams({
              postId: item.id,
              subspaceId: item.subspace_id,
              authorAddress: item.author_address,
            });
          }}
          handlePressComment={() => {
            handlePressSelectedComment({
              postId: post.id,
              commentId: item.id,
              subspaceId: item.subspace_id,
              focusCommentBox: true,
            });
          }}
          handleProfilePicPress={() =>
            handleNavigateToProfile(item.author_address)
          }
          handlePressLike={() => {
            if (isPending) return;
            handleAddReaction(item.id);
          }}
          handlePressTip={() => {
            if (isPending) return;
            handlePressSendTips(item?.author?.address, item.id);
          }}
          handlePress={() => {
            if (isPending) return;
            handlePressSelectedComment({
              postId: post.id,
              commentId: item.id,
              subspaceId: item.subspace_id,
            });
          }}
          handleLongPress={() => console.log('longPress')}
          text={item.text}
          creation_date={item.creation_date}
          isPending={isPending}
          attachments={item.attachments}
          reactions={item.reactions}
          tips={item.tips}
          author={isPending ? profileData || ({} as any) : item.author}
        />
      );
    },
    [comments, profile?.address, popupMenuParams],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label="No comments yet" />;
  }, []);

  const countersImages = useMemo(() => {
    const reactionsImages = reactions.map((reaction: any) => {
      if (reaction.author.profile_pic) {
        return {uri: reaction.author.profile_pic};
      } else {
        return defaultProfilePic;
      }
    });
    const tipsImages = tips.map((tip: any) => {
      if (tip.sender.profile_pic) {
        return {uri: tip.sender.profile_pic};
      } else {
        return defaultProfilePic;
      }
    });
    return _.unionBy(reactionsImages, tipsImages, 'uri') as any[];
  }, [reactions, tips]);

  const headerComponent = useMemo(
    () => (
      <>
        <PostComponent postData={post} />
        <PostActionButtonsBar
          postCommented={post?.commentPresence?.aggregate?.count > 0}
          postTipped={post?.tipPresence?.aggregate?.count > 0}
          postLiked={post?.reactionPresence?.aggregate?.count > 0}
          handleLikePress={() => handleAddReaction(post.id)}
          handleCommentPress={focusTextInputRef}
          handleTipPress={() =>
            handlePressSendTips(post?.author?.address, post.id)
          }
        />
        <Spacer paddingVertical={16}>
          <InteractionCountersBar
            loading={reactionsLoading && tipsLoading}
            likesCounter={reactions.length}
            tipsCounter={tips.length}
            handlePressCounters={handlePressCounters}
            accountsHighlitedPics={countersImages}
          />
        </Spacer>
        <Divider style={styles.divider} />
        <Spacer paddingBottom={16} />
      </>
    ),
    [post, reactions, countersImages],
  );

  const CustomTopBar = React.useMemo(() => {
    return (
      <View style={styles.customTopBarContainer}>
        <View style={styles.customTopBarInnerContainer}>
          <BackButton onPress={goBack} />

          <Spacer paddingLeft={theme.spacing.m}>
            <View style={styles.rightContainer}>
              {Avatar}
              <View style={styles.middleTextContainer}>
                <Typography.Subtitle3 numberOfLines={1}>
                  {post?.author?.nickname || `@${post?.author?.dtag}`}
                </Typography.Subtitle3>
                <Typography.Body7>{formattedDate}</Typography.Body7>
              </View>
            </View>
          </Spacer>
        </View>

        <View style={styles.rightContainer}>
          {activeAddress !== post?.author?.address && (
            <ImageButton
              style={[styles.followIcon]}
              image={isFollowingAddress ? unfollowBlackIcon : followBlackIcon}
              onPress={async () => {
                await followOrUnfollowUser({
                  addrToFollow: post?.author?.address,
                });
              }}
            />
          )}
          <ImageButton
            onPress={() => {
              setProfileMenuAnchor({
                x: Dimensions.get('window').width * 0.95,
                y: verticalScale(35) + top,
              });
              setProfileMenuVisible(true);
            }}
            style={styles.moreIcon}
            image={moreBlackIcon}
          />
        </View>
      </View>
    );
  }, [
    followOrUnfollowUser,
    activeAddress,
    Avatar,
    formattedDate,
    post?.author,
    popupMenuParams,
  ]);

  return postLoading || !post ? (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ActivityIndicator color={theme.colors.surfaceBlack} />
    </SafeAreaView>
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={CustomTopBar}>
      <FlashList
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={postLoading}
        onRefresh={pageRefetch}
        ListHeaderComponent={
          postLoading || !post ? <ActivityIndicator /> : headerComponent
        }
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => String(item.id)}
        estimatedItemSize={160}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={comments}
        ListEmptyComponent={ListEmptyComponent}
        keyboardDismissMode="on-drag"
      />
      <EnterCommentBottomBar
        loading={postCommentLoading}
        handlePostComment={handlePostComment}
        textInputRef={textInputRef}
        profileImage={
          profileData?.profile_pic
            ? {uri: profileData?.profile_pic}
            : defaultProfilePic
        }
        onIconPress={() =>
          handleExpandComment({author: post.author, postId: post.id})
        }
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
            icon: isFollowingAddress ? unfollowBlackIcon : followBlackIcon,
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
      <PopupMenu
        anchor={profileMenuAnchor}
        visible={profileMenuVisible}
        closeMenu={() => setProfileMenuVisible(false)}
        menuItems={[
          {
            label: t('share'),
            onPress: () => console.log('share'),
            icon: shareBlackIcon,
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

export default PostDetails;
