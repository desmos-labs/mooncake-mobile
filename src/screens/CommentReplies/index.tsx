import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {defaultProfilePic, followBlackIcon, reportIcon} from 'assets/images';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import PopupMenu from 'components/PopupMenu';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import {RootNavigatorParamList} from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  View,
} from 'react-native';
import {Divider, useTheme} from 'react-native-paper';
import InteractionSwitch from 'screens/PostDetails/components/InteractionSwitch';
import ItemSeparatorComponent from 'screens/PostInteraction/components/ItemSeparatorComponent';
import CommentItem from 'screens/PostInteraction/PostComments/components/CommentItem';
import ReactionItem from 'screens/PostInteraction/PostReactions/components/ReactionItem';
import TipItem from 'screens/PostInteraction/PostTips/components/TipItem';
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
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();

  const {
    mainComment,
    mainCommentLoading,
    mainCommentRefetch,
    comments,
    reactions,
  } = useHooks({
    subspaceID: params.subspaceId,
    commentID: params.commentId,
  });

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
    ({item, index}: ListRenderItemInfo<any>) => {
      if (index === 0) {
        return (
          <InteractionSwitch
            selectedIndex={selectedIndex}
            setSelectedIndex={setSelectedIndex}
            sections={[
              {sectionName: t('comments'), counter: comments.length},
              {sectionName: t('reactions'), counter: reactions.length},
              {sectionName: t('tips'), counter: 0},
            ]}
          />
        );
      }
      if (selectedIndex === 0) {
        return (
          <CommentItem
            disableInnerComment={true}
            handlePressMore={() => console.log('test')}
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
            {...item.post}
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

  const headerComponent = React.useMemo(() => {
    return (
      <>
        <CommentItem
          handlePressMore={() => console.log('test')}
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
          {...mainComment}
        />
        <Divider style={styles.divider} />
      </>
    );
  }, [mainComment]);

  const flatListData = useMemo(() => {
    if (selectedIndex === 0) return comments;
    else if (selectedIndex === 1) return reactions;
    else return [];
  }, [selectedIndex, comments, reactions]);

  return mainCommentLoading ? (
    <ActivityIndicator />
  ) : (
    <DView
      disableHideKeyboardTouchable={true}
      backgroundColor={theme.colors.white}
      edges={['top']}
      style={styles.root}
      topBar={<TopBar style={styles.topBar} centerElement={MiddleElement} />}>
      <FlatList
        scrollEnabled={true}
        refreshing={mainCommentLoading}
        onRefresh={() =>
          mainCommentRefetch({
            ID: params.commentId,
            subspaceID: params.subspaceId,
          })
        }
        keyExtractor={item => item.id}
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={[0 as any, ...flatListData]}
      />
      <EnterCommentBottomBar
        profileImage={
          mainComment?.author.profile_pic
            ? {uri: mainComment?.author.profile_pic}
            : defaultProfilePic
        }
        onIconPress={() => handlePressComment}
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
    </DView>
  );
};

export default CommentReplies;
