import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {NavProps} from 'screens/PostDetails/index';
import {GetPostComments} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';
import useFormatTimeForPostDetails from 'lib/FormatUtils/useFormatTimeForPostDetails';

const useHooks = ({id, sId}: {id: number; sId: number}) => {
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {
    data: originalPost,
    loading: postLoading,
    refetch: postRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: id,
      subspaceID: sId,
    },
  });

  const {
    data: postComments,
    loading: commentsLoading,
    refetch: commentsRefetch,
  } = useQuery(GetPostComments, {
    variables: {
      postID: id,
      subspaceID: sId,
    },
  });

  const {
    data: postReactions,
    loading: reactionsLoading,
    refetch: reactionsRefetch,
  } = useQuery(GetPostReactions, {
    variables: {
      postID: id,
      subspaceID: sId,
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
    if (!postReactions) return [];
    return postReactions.reaction;
  }, [postReactions]);

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
    ({author, postId}: {author: PostAuthor; postId: string}) => {
      navigate(ROUTES.ENTER_COMMENT, {
        author,
        postId,
      });
    },
    [],
  );

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
        postId: id,
        subspaceId: sId,
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
  };
};

export default useHooks;
