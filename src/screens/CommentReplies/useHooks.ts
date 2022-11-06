import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import sharedPostState from '@recoil/sharedPostState';
import ROUTES from 'navigation/routes';
import React, {useMemo, useRef} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {NavProps} from 'screens/CommentReplies/index';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostDetailsAndUserActionsPresence from 'services/graphql/queries/GetPostDetailsAndUserActionsPresence';
import {GetPostTips} from 'services/graphql/queries/GetPostTips';
import {GetPostReactions} from 'services/graphql/queries/GetReactions';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import {isTxHashInLatestPost} from 'hooks/usePendingPosts';
import EnvConfig from 'config/EnvConfig';
import {
  pendingCommentsByPost,
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import {FlatList} from 'react-native';

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
    await mainCommentRefetch({
      postID: commentID,
      subspaceID,
    });
    await commentsRefetch({
      postID: commentID,
      subspaceID,
    });
    await reactionsRefetch({
      postID: commentID,
      subspaceID,
    });
    await tipsRefetch({
      postID: commentID,
      subspaceID,
    });
  };

  const handlePressCounters = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: commentID,
        subspaceId: subspaceID,
      },
    });
  }, []);

  const handlePressReport = React.useCallback(
    (postId: number, subspaceId: number) => {
      navigate(ROUTES.REPORT_POST, {
        postId,
        subspaceId,
      });
    },
    [],
  );

  const handleCommentReply = React.useCallback(async () => {
    await createPost({conversationId: postID, referencedPostId: commentID});
  }, [postID, commentID, createPost]);

  const handleAddReaction = React.useCallback(
    async (postId: number) => {
      const result = await addOrRemoveReaction({postId});

      console.log(result);
    },
    [addOrRemoveReaction],
  );

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const handlePressSendTips = React.useCallback(
    (postAuthor: string, postId: number) => {
      navigate(ROUTES.SEND_TIPS, {postAuthor, postId});
    },
    [],
  );

  const handleExpandComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: number}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

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
    commentReplyLoading: loading,
    pageRefetch,
    handleAddReaction,
    handlePressReport,
    scrollViewRef,
  };
};

export default useHooks;
