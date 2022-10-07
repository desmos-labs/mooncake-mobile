import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import activeProfileState from '@recoil/activeProfileState';
import {
  defaultProfilePic,
  followBlackIcon,
  followOrangeIcon,
  moreBlackIcon,
  reportIcon,
  shareBlackIcon,
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
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  KeyboardEventName,
  ListRenderItemInfo,
  Platform,
  View,
} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {verticalScale} from 'react-native-size-matters';
import {useRecoilState, useRecoilValue} from 'recoil';
import InteractionCountersBar from 'screens/PostDetails/components/InteractionCountersBar';
import PostActionButtonsBar from 'screens/PostDetails/components/PostActionButtonsBar';
import EmptyListComponent from 'screens/PostInteraction/components/EmptyListComponent';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import {followedAddressesState} from '@recoil/following';
import useActiveAccount from 'hooks/useActiveAccount';
import useFollowOrUnfollowUser from 'services/axios/requests/CentralizedBroadcastTx/ManageRelationship/useFollowOrUnfollowUser';
import useHooks from './useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.POST_DETAILS
>;

export type PostDetailsParams = {
  /**
   * id of the post
   */
  postId: number;
  /**
   * susbpace_id of the post
   */
  subspaceID: number;
  /**
   * focus the comment box when navigating to this screen
   */
  focusCommentBox: boolean;
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
  }>();
  const followedAddresses = useRecoilValue(followedAddressesState);
  const {activeAddress} = useActiveAccount();
  const {followOrUnfollowUser} = useFollowOrUnfollowUser();

  const {
    profile,
    post,
    postLoading,
    comments,
    commentsLoading,
    reactions,
    reactionsLoading,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressCounters,
    handlePressSendTips,
    navigateToProfile,
    handlePostComment,
    handleAddReaction,
    postCommentLoading,
    handlePressReport,
    pageRefetch,
  } = useHooks({
    postID: params.postId,
    subspaceID: params.subspaceID,
  });

  const {top} = useSafeAreaInsets();
  const scrollViewRef = useRef<FlatList>(null);
  useFocusEffect(
    React.useCallback(() => {
      setPopupMenuParams({
        postId: post.id,
        subspaceId: post.subspace_id,
      });
      pageRefetch();
    }, [post, params]),
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

  const Avatar = React.useMemo(() => {
    if (post?.author?.profile_pic) {
      return (
        <ProfileHeaderButton
          imageSrc={{uri: post?.author.profile_pic}}
          onPress={() => navigateToProfile(post?.author?.address)}
        />
      );
    }
    return (
      <ProfileHeaderButton
        imageSrc={defaultProfilePic}
        onPress={() => navigateToProfile(post?.author?.address)}
      />
    );
  }, [post?.author?.profile_pic]);

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
      return (
        <CommentItem
          liked={item?.reactionPresence?.aggregate?.count > 0}
          repliesCounter={item?.repliesCount.aggregate.count}
          handlePressMore={event => {
            setAnchor({
              x: event.nativeEvent.pageX,
              y: event.nativeEvent.pageY,
            });
            setMenuVisible(true);
            setPopupMenuParams({postId: item.id, subspaceId: item.subspace_id});
          }}
          handlePressComment={() => {
            console.log('hello world');
          }}
          handlePressLike={() => handleAddReaction(item.id)}
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
          handleLongPress={() => console.log('longPress')}
          loading={commentsLoading}
          {...item}
        />
      );
    },
    [comments, profile?.address, popupMenuParams],
  );

  const ListEmptyComponent = React.useMemo(() => {
    return <EmptyListComponent label="No comments yet" />;
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

  const headerComponent = useMemo(
    () => (
      <>
        <PostComponent postData={post} />
        <PostActionButtonsBar
          postLiked={post?.reactionPresence?.aggregate?.count > 0}
          handleLikePress={() => handleAddReaction(post.id)}
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
            handlePressCounters={handlePressCounters}
            accountsHighlitedPics={likesImages}
          />
        </Spacer>
        <Divider style={styles.divider} />
        <Spacer paddingBottom={16} />
      </>
    ),
    [post, reactions, likesImages],
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
              style={[
                styles.followIcon,
                followedAddresses.has(post?.author?.address) && {
                  tintColor: theme.colors.primary,
                },
              ]}
              image={followOrangeIcon}
              onPress={() => {
                followOrUnfollowUser(post?.author?.address);
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
    <SafeAreaView>
      <ActivityIndicator />
    </SafeAreaView>
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={CustomTopBar}>
      <FlatList
        ref={scrollViewRef}
        scrollEnabled={true}
        refreshing={postLoading}
        onRefresh={() => pageRefetch()}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={[...comments]}
        ListEmptyComponent={ListEmptyComponent}
      />
      <EnterCommentBottomBar
        loading={postCommentLoading}
        handlePostComment={handlePostComment}
        focusTextInput={params.focusCommentBox}
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
