import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import {pendingCommentsByPost} from '@recoil/pendingTx/pendingPosts';
import sharedPostState from '@recoil/sharedPostState';
import useActiveAccount from 'hooks/useActiveAccount';
import useNavigateToProfile from 'hooks/useNavigateToProfile';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo, useRef} from 'react';
import {FlatList, Keyboard, KeyboardEventName, Platform} from 'react-native';
import {useRecoilValue, useResetRecoilState} from 'recoil';
import {NavProps} from 'screens/CommentReplies/index';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostDetailsAndUserActionsPresence from 'services/graphql/queries/GetPostDetailsAndUserActionsPresence';
import {GetPostTips} from 'services/graphql/queries/GetPostTips';
import {GetPostReactions} from 'services/graphql/queries/GetReactions';
import useSubscribeToCommentReplies from 'hooks/subscriptions/useSubscribeToCommentReplies';
import usePendingPosts from 'hooks/usePendingPosts';

const useHooks = ({
  postID,
  subspaceID,
  commentID,
}: {
  postID: number;
  subspaceID: number;
  commentID: number;
}) => {
  const {activeAddress} = useActiveAccount();
  const {createPost, loading} = useCreatePost();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {handleNavigateToProfile} = useNavigateToProfile();
  const {addOrRemoveReaction} = useAddOrRemoveReaction();
  const {resolveByExternalId} = usePendingPosts();

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
      user: activeAddress,
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
  } = useQuery(GetCommentReplies, {
    variables: {
      postID: commentID,
      subspaceID,
      user: activeAddress,
      reaction: {
        '@type': '/desmos.reactions.v1.RegisteredReactionValue',
        registered_reaction_id: 9,
      },
    },
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
  });

  useSubscribeToCommentReplies({
    commentID,
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

  const pendingCommentsOfPost = useRecoilValue(
    pendingCommentsByPost(commentID),
  );

  /**
   * Batch pending txHashes for removal if they have been broadcasted
   */
  React.useEffect(() => {
    if (!commentReplies) return;
    const _comments = commentReplies.post_reference.map((x: any) => x.post);
    _comments.map((x: PostItem) => x.external_id).forEach(resolveByExternalId);
  }, [commentReplies]);

  const comments = useMemo(() => {
    if (!commentReplies) return [];
    return [
      ...commentReplies.post_reference.map((x: any) => x.post),
      ...pendingCommentsOfPost.map(x => x.postData).reverse(),
    ];
  }, [commentReplies, pendingCommentsOfPost]);

  const pageRefetch = useCallback(async () => {
    await Promise.all([
      mainCommentRefetch,
      commentsRefetch,
      reactionsRefetch,
      tipsRefetch,
    ]);
  }, [mainCommentRefetch, commentsRefetch, reactionsRefetch, tipsRefetch]);

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
