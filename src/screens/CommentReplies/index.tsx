import {useQuery} from '@apollo/client';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {followBlackIcon, reportIcon} from 'assets/images';
import DView from 'components/DView';
import EnterCommentBottomBar from 'components/EnterCommentBottomBar';
import PopupMenu from 'components/PopupMenu';
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
import {Divider, useTheme} from 'react-native-paper';
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

export type CommentRepliesParams = {
  commentId: number;
  subspaceId: number;
};

const CommentReplies = () => {
  const styles = useStyles();
  const theme = useTheme();
  const {t} = useTranslation('postDetails');
  const {params} = useRoute<NavProps['route']>();
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {data, loading, refetch} = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: params.postId,
      subspaceID: params.subspaceID,
    },
  });
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [anchor, setAnchor] = React.useState<{x: number; y: number}>();

  const {DUMMY_COMMENTS, DUMMY_AUTHOR} = useHooks();

  const post = React.useMemo(() => {
    if (!data) return undefined;

    return data.posts[0];
  }, [data]);

  useEffect(() => {
    if (!loading) {
      console.log(post);
    }
  }, [post]);

  const MiddleElement = useMemo(
    () => (
      <View style={styles.rightContainer}>
        <Typography.Subtitle3 numberOfLines={1}>
          {DUMMY_COMMENTS.length} {t('replies')}
        </Typography.Subtitle3>
      </View>
    ),
    [post],
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
          {...DUMMY_COMMENTS[0]}
        />
        <Divider style={styles.divider} />
      </>
    );
  }, []);

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
      topBar={<TopBar style={styles.topBar} centerElement={MiddleElement} />}>
      <FlatList
        scrollEnabled={true}
        refreshing={loading}
        onRefresh={() =>
          refetch({ID: params.postId, subspaceID: params.subspaceID})
        }
        ListHeaderComponent={headerComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        keyExtractor={item => item.id}
        ListEmptyComponent={ListEmptyComponent}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContainer}
        data={[0 as any, ...DUMMY_COMMENTS]}
      />
      <EnterCommentBottomBar
        profileImage={{uri: post?.author.profile_pic}}
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
