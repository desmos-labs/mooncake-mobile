import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import {
  pendingCommentsByPost,
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import sharedPostState from '@recoil/sharedPostState';
import EnvConfig from 'config/EnvConfig';
import {isTxHashInLatestPost} from 'hooks/usePendingPosts';
import ROUTES from 'navigation/routes';
import React, {useMemo, useRef} from 'react';
import {FlatList, Keyboard, KeyboardEventName, Platform} from 'react-native';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {NavProps} from 'screens/CommentReplies/index';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostDetailsAndUserActionsPresence from 'services/graphql/queries/GetPostDetailsAndUserActionsPresence';
import {GetPostTips} from 'services/graphql/queries/GetPostTips';
import {GetPostReactions} from 'services/graphql/queries/GetReactions';
import useSubscribeToPostComments from 'hooks/subscriptions/useSubscribeToPostComments';

const useHooks = ({
  postID,
  subspaceID,
  commentID,
}: {
  postID: number;
  subspaceID: number;
  commentID: number;
}) => {
  const [profile] = useRecoilState(activeProfileState);
  const {createPost, loading} = useCreatePost();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {addOrRemoveReaction} = useAddOrRemoveReaction();

  const scrollViewRef = useRef<FlatList>(null);

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  React.useEffect(() => {
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
  }, [scrollViewRef]);

  const {
    data: originalComment,
    loading: mainCommentLoading,
    refetch: mainCommentRefetch,
  } = useQuery(GetPostDetailsAndUserActionsPresence, {
    variables: {
      postID: commentID,
      subspaceID,
      user: profile?.address,
      reaction: {
        '@type': '/desmos.reactions.v1.RegisteredReactionValue',
        registered_reaction_id: 9,
      },
    },
  });

  const {
    data: commentReplies,
    loading: commentsLoading,
    refetch: commentsRefetch,
    startPolling,
    stopPolling,
  } = useQuery(GetCommentReplies, {
    variables: {
      postID: commentID,
      subspaceID,
      user: profile?.address,
      reaction: {
        '@type': '/desmos.reactions.v1.RegisteredReactionValue',
        registered_reaction_id: 9,
      },
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: commentReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID: commentID,
      subspaceID,
    },
  });

  const {
    data: postTips,
    loading: tipsLoading,
    refetch: tipsRefetch,
  } = useQuery(GetPostTips, {
    variables: {
      postID: commentID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  useSubscribeToPostComments({
    postID: commentID,
    updateAction: commentsRefetch,
  });

  const mainComment = React.useMemo(() => {
    if (!originalComment) return undefined;
    return originalComment.posts[0];
  }, [originalComment]);

  const reactions = useMemo(() => {
    if (!commentReactions) return [];
    return commentReactions.reaction;
  }, [commentReactions]);

  const tips = useMemo(() => {
    if (!postTips) return [];
    return postTips.tip_post;
  }, [postTips]);

  const setPendingComments = useSetRecoilState(
    pendingPostsState(PendingPostEnum.COMMENT),
  );

  const pendingCommentsOfPost = useRecoilValue(
    pendingCommentsByPost(commentID),
  );

  /**
   * Batch pending txHashes for removal if they have been broadcasted
   */
  React.useEffect(() => {
    if (!commentReplies) return;
    const _comments = commentReplies.post_reference.map((x: any) => x.post);
    const txHashesToRemove: string[] = [];
    pendingCommentsOfPost.forEach(x => {
      const comment = isTxHashInLatestPost(x.txHash, _comments);
      if (comment) {
        txHashesToRemove.push(x.txHash);
      }
    });
    setPendingComments(prev =>
      prev.filter(x => !txHashesToRemove.includes(x.txHash)),
    );
  }, [commentReplies]);

  /**
   * Start/stop polling comments if there is a pending comment for the parent post.
   */
  React.useEffect(() => {
    if (pendingCommentsOfPost.length > 0) {
      startPolling(EnvConfig.POLLING_INTERVAL);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd();
      }, 500);
    } else stopPolling();
  }, [scrollViewRef, pendingCommentsOfPost]);

  const comments = useMemo(() => {
    if (!commentReplies) return [];
    return [
      ...commentReplies.post_reference.map((x: any) => x.post),
      ...pendingCommentsOfPost.map(x => x.postData).reverse(),
    ];
  }, [commentReplies, pendingCommentsOfPost]);

  const pageRefetch = async () => {
    await Promise.all([
      mainCommentRefetch,
      commentsRefetch,
      reactionsRefetch,
      tipsRefetch,
    ]);
  };

  const handlePressCounters = () =>
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: commentID,
        subspaceId: subspaceID,
      },
    });

  const handlePressReport = (postId: number, subspaceId: number) =>
    navigate(ROUTES.REPORT_POST, {
      postId,
      subspaceId,
    });

  const handleNavigateToProfile = (address: string) =>
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: address,
    });

  const handleCommentReply = () =>
    createPost({conversationId: postID, referencedPostId: commentID});

  const handleAddReaction = (postId: number) =>
    addOrRemoveReaction({postId, stayOnCurrentScreen: true});

  const handlePressSendTips = (postAuthor: string, postId: number) => {
    navigate(ROUTES.SEND_TIPS, {postAuthor, postId});
  };

  const handleExpandComment = ({
    author,
    postId,
  }: {
    author: PostAuthor;
    postId: number;
  }) => {
    navigate(ROUTES.ENTER_COMMENT, {
      author,
      postId,
    });
  };

  return {
    mainComment,
    mainCommentLoading,
    mainCommentRefetch,
    comments,
    commentsLoading,
    commentsRefetch,
    reactions,
    reactionsLoading,
    reactionsRefetch,
    tips,
    tipsLoading,
    tipsRefetch,
    handlePressCounters,
    handlePressSendTips,
    handleExpandComment,
    handleCommentReply,
    handleNavigateToProfile,
    commentReplyLoading: loading,
    pageRefetch,
    handleAddReaction,
    handlePressReport,
    scrollViewRef,
  };
};

export default useHooks;
