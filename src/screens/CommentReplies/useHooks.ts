import {useLazyQuery, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import sharedPostState from '@recoil/sharedPostState';
import EnvConfig from 'config/EnvConfig';
import ToastConfig from 'config/ToastConfig';
import useCheckAndUpdateGrants from 'hooks/authGrants/useCheckAndUpdateGrants';
import {GrantEnums} from 'lib/desmos/msgtypes';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useToast} from 'react-native-toast-notifications';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {NavProps} from 'screens/CommentReplies/index';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import useManageReactions from 'services/axios/requests/CentralizedBroadcastTx/ManageReaction/useManageReactions';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostDetailsAndReactionPresence from 'services/graphql/queries/GetPostDetailsAndReactionPresence';
import GetPostTips from 'services/graphql/queries/GetPostTips';
import {
  GetPostReactions,
  GetReactionForPostAndAuthor,
} from 'services/graphql/queries/GetReactions';

const useHooks = ({
  subspaceID,
  commentID,
}: {
  subspaceID: number;
  commentID: number;
}) => {
  const [profile] = useRecoilState(activeProfileState);
  const {createPost, loading} = useCreatePost();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const {navigate} = useNavigation<NavProps['navigation']>();
  const {manageReaction} = useManageReactions();
  const {checkAndUpdateGrants} = useCheckAndUpdateGrants();
  const toast = useToast();

  const {
    data: originalComment,
    loading: mainCommentLoading,
    refetch: mainCommentRefetch,
  } = useQuery(GetPostDetailsAndReactionPresence, {
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

  const [getReactionForPostAndAuthor, {data: reactionAdded}] = useLazyQuery(
    GetReactionForPostAndAuthor,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const getReaction = useCallback(
    async ({
      id,
      subspace_id,
    }: {
      id: number;
      subspace_id: number;
      address: string;
    }) => {
      return getReactionForPostAndAuthor({
        variables: {
          postID: id,
          subspaceID: subspace_id,
          address: profile?.address,
        },
      });
    },
    [profile?.address],
  );

  const mainComment = React.useMemo(() => {
    if (!originalComment) return undefined;
    return originalComment.posts[0];
  }, [originalComment]);

  const comments = useMemo(() => {
    if (!commentReplies) return [];
    return commentReplies.post_reference;
  }, [commentReplies]);

  const reactions = useMemo(() => {
    if (!commentReactions) return [];
    return commentReactions.reaction;
  }, [commentReactions]);

  const tips = useMemo(() => {
    if (!postTips) return [];
    return postTips.tip_post;
  }, [postTips]);

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
      expandOnOpen: true,
      allowPanning: true,
      postId: commentID,
      subspaceId: subspaceID,
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
    await createPost({conversationId: commentID, referencedPostId: commentID});
  }, [commentID]);

  const handleAddReaction = React.useCallback(
    async (postId: number) => {
      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ];
      // check if user has grants first
      const {success} = await checkAndUpdateGrants({
        grantsToRequest,
        address: profile?.address!,
      });

      if (success) {
        const {data} = await getReaction({
          id: postId,
          subspace_id: EnvConfig.APP_SUBSPACE_ID,
          address: profile?.address!,
        });
        await manageReaction({
          postId,
          user: profile?.address!,
          reactionId: data?.reaction[0] ? data?.reaction[0].id : undefined,
        });
      } else {
        toast.show('[PLACEHOLDER]Authorization is required.', {
          type: ToastConfig.ERROR_NO_RETRY,
        });
      }
    },
    [profile?.address, reactionAdded],
  );

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const handlePressSendTips = React.useCallback((postAuthor: string) => {
    navigate(ROUTES.SEND_TIPS, {postAuthor});
  }, []);

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
  };
};

export default useHooks;
