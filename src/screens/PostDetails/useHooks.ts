import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import sharedPostState from '@recoil/sharedPostState';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import ROUTES from 'navigation/routes';
import React, {useMemo, useRef} from 'react';
import {
  useRecoilState,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import {NavProps} from 'screens/PostDetails/index';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/useCreatePost';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostDetailsAndUserActionsPresence from 'services/graphql/queries/GetPostDetailsAndUserActionsPresence';
import {GetPostTips} from 'services/graphql/queries/GetPostTips';
import {GetPostReactions} from 'services/graphql/queries/GetReactions';
import useAddOrRemoveReaction from 'services/axios/requests/CentralizedBroadcastTx/useAddOrRemoveReaction';
import {
  pendingCommentsByPost,
  PendingPostEnum,
  pendingPostsState,
} from '@recoil/pendingTx/pendingPosts';
import {isTxHashInLatestPost} from 'hooks/usePendingPosts';
import EnvConfig from 'config/EnvConfig';
import {FlatList} from 'react-native';
import useSubscribeToPostComments from 'hooks/subscriptions/useSubscribeToPostComments';

const useHooks = ({
  postID,
  subspaceID,
}: {
  postID: number;
  subspaceID: number;
}) => {
  const {navigate} = useNavigation<NavProps['navigation']>();
  const [profile] = useRecoilState(activeProfileState);
  const {createPost, loading} = useCreatePost();
  const {addOrRemoveReaction} = useAddOrRemoveReaction();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const pendingCommentsOfPost = useRecoilValue(pendingCommentsByPost(postID));
  const setPendingComments = useSetRecoilState(
    pendingPostsState(PendingPostEnum.COMMENT),
  );
  const scrollViewRef = useRef<FlatList>(null);

  const {
    data: originalPost,
    loading: postLoading,
    refetch: postRefetch,
  } = useQuery(GetPostDetailsAndUserActionsPresence, {
    variables: {
      postID,
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
    data: postComments,
    loading: commentsLoading,
    refetch: commentsRefetch,
    startPolling,
    stopPolling,
  } = useQuery(GetPostComments, {
    variables: {
      postID,
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
    data: postReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: postTips,
    loading: tipsLoading,
    refetch: tipsRefetch,
  } = useQuery(GetPostTips, {
    variables: {
      postID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  useSubscribeToPostComments({
    postID,
    updateAction: commentsRefetch,
  });

  /**
   * Batch pending txHashes for removal if they have been broadcasted
   */
  React.useEffect(() => {
    if (!postComments) return;
    const txHashesToRemove: string[] = [];
    pendingCommentsOfPost.forEach(x => {
      const comment = isTxHashInLatestPost(x.txHash, postComments.post);
      if (comment) {
        txHashesToRemove.push(x.txHash);
      }
    });
    setPendingComments(prev =>
      prev.filter(x => !txHashesToRemove.includes(x.txHash)),
    );
  }, [postComments]);

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
    if (!postComments) return [];

    return [
      ...postComments.post,
      ...pendingCommentsOfPost.map(x => x.postData).reverse(),
    ];
  }, [pendingCommentsOfPost, postComments]);

  const pageRefetch = async () => {
    await Promise.all([
      postRefetch,
      commentsRefetch,
      reactionsRefetch,
      tipsRefetch,
    ]);
  };

  const post = React.useMemo(() => {
    if (!originalPost) return {};
    return originalPost.posts[0];
  }, [originalPost]);

  const reactions = useMemo(() => {
    if (!postReactions) return [];
    return postReactions.reaction;
  }, [postReactions]);

  const tips = useMemo(() => {
    if (!postTips) return [];
    return postTips.tip_post;
  }, [postTips]);

  const formattedDate = useFormatTimeForPostDetails(post?.creation_date);

  const handlePressSelectedComment = React.useCallback(
    ({
      postId,
      commentId,
      subspaceId,
    }: {
      postId: number;
      commentId: number;
      subspaceId: number;
    }) => {
      navigate(ROUTES.COMMENT_REPLIES, {
        postId,
        commentId,
        subspaceId,
      });
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

  const handlePostComment = React.useCallback(async () => {
    await createPost({conversationId: postID, referencedPostId: postID});
  }, [postID]);

  const handleAddReaction = React.useCallback(
    async (postId: number) => {
      const result = await addOrRemoveReaction({
        postId,
        stayOnCurrentScreen: true,
      });
      console.log(result);
    },
    [addOrRemoveReaction],
  );

  const handlePressReport = React.useCallback(
    (postId: number, subspaceId: number) => {
      navigate(ROUTES.REPORT_POST, {
        postId,
        subspaceId,
      });
    },
    [],
  );

  const handleNavigateToProfile = (address: string) =>
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: address,
    });

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const navigateToProfile = React.useCallback((authorAddress: string) => {
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: authorAddress,
    });
  }, []);

  const handlePressSendTips = React.useCallback(
    (postAuthor: string, postId: number) => {
      navigate(ROUTES.SEND_TIPS, {postAuthor, postId});
    },
    [],
  );

  const handlePressCounters = React.useCallback(() => {
    navigate(ROUTES.POST_INTERACTION, {
      screen: ROUTES.POST_REACTIONS,
      params: {
        expandOnOpen: true,
        allowPanning: true,
        postId: postID,
        subspaceId: subspaceID,
      },
    });
  }, []);

  return {
    profile,
    post,
    postLoading,
    comments,
    commentsLoading,
    reactions,
    reactionsLoading,
    tips,
    tipsLoading,
    formattedDate,
    handlePressSelectedComment,
    handleExpandComment,
    handlePressCounters,
    handlePressSendTips,
    navigateToProfile,
    handlePostComment,
    handleAddReaction,
    handleNavigateToProfile,
    postCommentLoading: loading,
    handlePressReport,
    pageRefetch,
    scrollViewRef,
    commentsRefetch,
  };
};

export default useHooks;
