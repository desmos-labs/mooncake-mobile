import {useFocusEffect, useRoute} from '@react-navigation/native';
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
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import ImageButton from 'components/ImageButton';
import PopupMenu from 'components/PopupMenu';
import PostComponent from 'components/PostComponent';
import ProfileHeaderButton from 'components/ProfileHeaderButton';
import Spacer from 'components/Spacer';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {verticalScale} from 'react-native-size-matters';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
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
  const [profileData] = useRecoilState(activeProfileState);
  const [menuVisible, setMenuVisible] = useState(false);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState<{
    x: number;
    y: number;
  }>();
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();

  const {
    post,
    postLoading,
    postRefetch,
    comments,
    commentsLoading,
    commentsRefetch,
    reactions,
    reactionsLoading,
    reactionsRefetch,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressCounters,
    handlePressSendTips,
    navigateToProfile,
  } = useHooks({
    id: params.postId,
    sId: params.subspaceID,
  });

  const {top} = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      pageRefetch();
    }, [params]),
  );

  const pageRefetch = async () => {
    await postRefetch({ID: params.postId, subspaceID: params.subspaceID});
    await commentsRefetch({
      postID: params.postId,
      subspaceID: params.subspaceID,
    });
    await reactionsRefetch({
      postID: params.postId,
      subspaceID: params.subspaceID,
    });
  };

  const Avatar = React.useMemo(() => {
    if (post?.author?.profile_pic) {
      return (
        <ProfileHeaderButton
          imageSrc={{uri: post?.author.profile_pic}}
          onPress={() => navigateToProfile()}
        />
      );
    }
    return (
      <ProfileHeaderButton
        imageSrc={defaultProfilePic}
        onPress={() => navigateToProfile()}
      />
    );
  }, [post?.author?.profile_pic]);

  const MiddleElement = useMemo(
    () => (
      <View style={styles.rightContainer}>
        {Avatar}
        <View style={styles.middleTextContainer}>
          <Typography.Subtitle3 numberOfLines={1}>
            {post?.author?.nickname || `@${post?.author?.dtag}`}
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
          onPress={() => {
            // setProfileMenuAnchor({
            //   x: event.nativeEvent.pageX,
            //   y: event.nativeEvent.pageY,
            // });
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
    ),
    [],
  );

  const renderItem = React.useCallback(
    ({item}: ListRenderItemInfo<any>) => {
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
    },
    [comments],
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
          postLiked={false}
          handleLikePress={() => {
            console.log('hello world');
          }}
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
