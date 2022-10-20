import {StackScreenProps} from '@react-navigation/stack';
import {
  commentIcon,
  commentLikeEmptyIcon,
  tipIcon,
  commentLiked,
  tipIconTipped,
  commentIconCommented,
} from 'assets/images';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import {Button, Dimensions, LogBox, View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {CarouselRenderItemInfo} from 'react-native-reanimated-carousel/src/types';
import {verticalScale} from 'react-native-size-matters';
import InteractionButton from 'screens/Home/components/InteractionButton';
import NoMorePosts from 'screens/Home/components/NoMorePosts';
import PostCard from 'screens/Home/components/PostCard';
import useHooks from 'screens/Home/useHooks';
import {useTheme} from 'react-native-paper';
import usePendingPosts from '@recoil/pendingTx/pendingPosts';
import EnvConfig from 'config/EnvConfig';
import {GrantEnums} from 'lib/desmos/msgtypes';
import _ from 'lodash';
import {useToast} from 'react-native-toast-notifications';
import ToastConfig from 'config/ToastConfig';
import useStyles from './useStyles';

// This warning is emitted from react-native-reanimated-carousel, but it
// does not affect operation
LogBox.ignoreLogs([/Cannot record touch end without a touch start./]);

export type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.HOME_TABS
>;

export type HomeParams = {
  type: 'discover' | 'following';
};

const Home = () => {
  const styles = useStyles();
  const toast = useToast();

  const {
    handlePressDetails,
    handlePressFollow,
    handlePressAuthor,
    handlePressTip,
    handleAddReaction,
    handlePressComments,
    onPostChanged,
    posts,
    selectedPostIndex,
    onCarouselProgressChange,
    isPostPending,
  } = useHooks();

  const {addNewPendingPost} = usePendingPosts();

  const debugAddPending = () => {
    addNewPendingPost({
      postData: {
        id: Math.random() * 10000,
        subspace_id: EnvConfig.APP_SUBSPACE_ID,
        isPending: true,

        text: 'hello world',

        attachments: [
          {
            id: 0,
            content: {
              uri: 'https://static.wikia.nocookie.net/mato-seihei-no-slave/images/0/0f/Volume_01.png/revision/latest?cb=20191208175048',
              mimeType: 'image/jpeg',
            },
          },
        ],

        author_address: 'desmos1dx6h75tkj0cuvyqf6cwn6usc9qynu39v0245m4',
      },
      txHash: 'hashyboi',
      timestamp: new Date().getTime(),
      msgType: GrantEnums.MsgCreatePost,
    });
  };

  const renderPost = React.useCallback(
    (info: CarouselRenderItemInfo<PostItem>) => {
      if (info.index === posts.length) {
        return <NoMorePosts />;
      }
      return (
        <PostCard
          postData={info.item}
          onPressAuthor={() => handlePressAuthor(info.item.author_address)}
          onPressDetails={() => {
            if (isPostPending(info.item.id)) {
              return toast.show('Post is being broadcasted...', {
                type: ToastConfig.ERROR_NO_RETRY,
              });
            }
            handlePressDetails(info.item.id, info.item.subspace_id);
          }}
          onPressFollow={() => handlePressFollow(info.item.author_address)}
        />
      );
    },
    [posts, handlePressFollow, handlePressAuthor, handlePressDetails],
  );

  const theme = useTheme();

  const currentPost = posts[selectedPostIndex];

  console.log(_.get(currentPost, 'repliesCount.aggregate.count'));

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <Carousel
        onProgressChange={onCarouselProgressChange}
        onSnapToItem={onPostChanged}
        mode="parallax"
        loop={false}
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 60,
        }}
        width={Dimensions.get('window').width}
        height={verticalScale(500)}
        style={styles.carousel}
        data={[...posts, 0 as any]}
        renderItem={renderPost}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
          failOffsetY: [-10, 10],
        }}
      />

      {!isPostPending(posts[selectedPostIndex].id) &&
        selectedPostIndex !== posts.length && (
          <View style={styles.interactionButtonGroup}>
            <InteractionButton
              onPress={() => {
                if (isPostPending(posts[selectedPostIndex].id)) return;
                handlePressComments(posts[selectedPostIndex].id);
              }}
              interactionCount={_.get(
                posts[selectedPostIndex],
                'repliesCount.aggregate.count',
                0,
              )}
              icon={
                _.get(
                  posts[selectedPostIndex],
                  'repliesCount.aggregate.count',
                  0,
                ) > 0
                  ? commentIconCommented
                  : commentIcon
              }
            />

            <InteractionButton
              onPress={() => {
                if (isPostPending(posts[selectedPostIndex].id)) {
                  return;
                }
                handleAddReaction(posts[selectedPostIndex].id);
              }}
              interactionCount={_.get(
                posts[selectedPostIndex],
                'reactions.length',
                0,
              )}
              icon={
                _.get(posts[selectedPostIndex], 'reactions.length', 0) > 0
                  ? commentLiked
                  : commentLikeEmptyIcon
              }
            />

            <InteractionButton
              onPress={() => {
                if (
                  isPostPending(posts[selectedPostIndex].id) ||
                  !posts[selectedPostIndex].author
                ) {
                  return;
                }
                handlePressTip(
                  posts[selectedPostIndex].author!.address,
                  posts[selectedPostIndex].id,
                );
              }}
              interactionCount={_.get(
                posts[selectedPostIndex],
                'tips.length',
                0,
              )}
              icon={
                _.get(posts[selectedPostIndex], 'tips.length', 0) > 0
                  ? tipIconTipped
                  : tipIcon
              }
            />
          </View>
        )}
      <Button title="debug add" onPress={debugAddPending} />
    </View>
  );
};

export default Home;
