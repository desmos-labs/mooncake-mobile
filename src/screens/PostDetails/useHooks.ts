import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import activeProfileState from '@recoil/activeProfileState';
import sharedPostState from '@recoil/sharedPostState';
import useCheckGrants from 'hooks/authGrants/useCheckGrants';
import useFormatTimeForPostDetails from 'hooks/useFormatTimeForPostDetails';
import {GrantEnums} from 'lib/desmos/msgtypes';
import Long from 'long';
import ROUTES from 'navigation/routes';
import React, {useMemo, useState} from 'react';
import {useRecoilState, useResetRecoilState} from 'recoil';
import {NavProps} from 'screens/PostDetails/index';
import useAddReaction from 'services/axios/requests/CentralizedBroadcastTx/AddReaction/useAddReaction';
import useCreatePost from 'services/axios/requests/CentralizedBroadcastTx/CreatePost/useCreatePost';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';

const useHooks = ({
  postID,
  subspaceID,
}: {
  postID: number;
  subspaceID: number;
}) => {
  const [userLiked, setUserLiked] = useState<boolean>(false);
  const {navigate, pop} = useNavigation<NavProps['navigation']>();
  const [profile] = useRecoilState(activeProfileState);
  const {createPost, loading} = useCreatePost();
  const {addReaction} = useAddReaction();
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
  });

  const post = React.useMemo(() => {
    if (!originalPost) return {};
    return originalPost.posts[0];
  }, [originalPost]);

  const comments = useMemo(() => {
    if (!postComments) return [];
    return postComments.post;
  }, [postComments]);

  const reactions = useMemo(() => {
    if (!postReactions) {
      return [];
    } else {
      postReactions.reaction.forEach(
        (reaction: {author: {address: string | undefined}}) => {
          if (reaction.author.address === profile?.address) {
            setUserLiked(true);
          }
        },
      );
      return postReactions.reaction;
    }
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
      const grantsToRequest: GrantEnums[] = [GrantEnums.MsgAddReaction];
      // check if user has grants first
      const grantsRequired = await checkGrants(grantsToRequest);

      if (grantsRequired.length > 0) {
        navigate(ROUTES.ACTION_AUTHORIZATION, {
          grants: grantsRequired,

          onApprove: async () => {
            pop();
            await addReaction({
              postId: Long.fromNumber(postId),
              user: profile?.address,
            });
          },
          onCancel: () => {
            pop();
            console.log('cancelled');
          },
        });
      } else {
        await addReaction({
          postId: Long.fromNumber(postId),
          user: profile?.address,
        });
      }
    },
    [postID, profile?.address],
  );

  React.useEffect(() => {
    resetSharedPostState();
  }, []);

  const navigateToProfile = React.useCallback(() => {
    navigate(ROUTES.USER_PROFILE, {
      visitingProfileAddress: post?.author.address,
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
    userLiked,
  };
};

export default useHooks;
