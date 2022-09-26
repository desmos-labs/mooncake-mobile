import {useLazyQuery, useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import sharedPostState from '@recoil/sharedPostState';
import EnvConfig from 'config/EnvConfig';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import {GrantEnums} from 'lib/desmos/msgtypes';
import ROUTES from 'navigation/routes';
import React, {useCallback, useMemo} from 'react';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {NavProps} from 'screens/PostDetails/index';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import useManangeReaction from 'services/axios/requests/CentralizedBroadcastTx/ManageReaction/useManangeReaction';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import {
  GetPostReactions,
  GetReactionForPostAndAuthor,
} from 'services/graphql/queries/GetReactions';

const useHooks = ({
  postID,
  subspaceID,
}: {
  postID: number;
  subspaceID: number;
}) => {
  const {navigate, pop} = useNavigation<NavProps['navigation']>();
  const [profile] = useRecoilState(activeProfileState);
  const {createPost, loading} = useCreatePost();
  const {manageReaction} = useManangeReaction();
  const resetSharedPostState = useResetRecoilState(sharedPostState);
  const {checkGrants} = useCheckGrants();

  const {
    data: originalPost,
    loading: postLoading,
    refetch: postRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      postID,
      subspaceID,
    },
    fetchPolicy: 'no-cache',
  });

  const {
    data: postComments,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery(GetPostComments, {
    variables: {
      postID,
      subspaceID,
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

  const post = React.useMemo(() => {
    if (!originalPost) return {};
    return originalPost.posts[0];
  }, [originalPost]);

  const comments = useMemo(() => {
    if (!postComments) return [];
    return postComments.post;
  }, [postComments]);

  const reactions = useMemo(() => {
    console.log('reactions');
    if (!postReactions) return [];
    return postReactions.reaction;
  }, [postReactions, profile?.address]);

  const pageRefetch = async () => {
    await postRefetch({
      postID,
      subspaceID,
    });
    await commentsRefetch({
      postID,
      subspaceID,
    });
    await reactionsRefetch({
      postID,
      subspaceID,
    });
    /*    await reactionAddedRefetch({
      postID,
      subspaceID,
      address: profile?.address,
    }); */
  };

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
      await getReaction({
        id: postId,
        subspace_id: EnvConfig.APP_SUBSPACE_ID,
        address: profile?.address!,
      });

      const grantsToRequest: GrantEnums[] = [
        GrantEnums.MsgAddReaction,
        GrantEnums.MsgRemoveReaction,
      ];
      // check if user has grants first
      const grantsRequired = await checkGrants(grantsToRequest);

      if (grantsRequired.length > 0) {
        navigate(ROUTES.ACTION_AUTHORIZATION, {
          grants: grantsRequired,

          onApprove: async () => {
            await manageReaction({
              postId,
              user: profile?.address!,
              reactionId: reactionAdded?.reaction[0]
                ? reactionAdded?.reaction[0].id
                : undefined,
            });
            pop();
          },
          onCancel: () => {
            pop();
            console.log('cancelled');
          },
        });
      } else {
        await manageReaction({
          postId,
          user: profile?.address!,
          reactionId: reactionAdded?.reaction[0]
            ? reactionAdded?.reaction[0].id
            : undefined,
        });
      }
    },
    [postID, profile?.address, reactionAdded],
  );

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const navigateToProfile = React.useCallback((authorAddress: string) => {
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: authorAddress,
    });
  }, []);

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

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
    handlePressSendTips,
    handlePressCounters,
    navigateToProfile,
    handlePostComment,
    handleAddReaction,
    postCommentLoading: loading,
    pageRefetch,
  };
};

export default useHooks;
