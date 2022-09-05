import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import React, {useMemo} from 'react';
import {NavProps} from 'screens/CommentReplies/index';
import {GetCommentReplies} from 'services/graphql/queries/GetComments';
import GetPostBySubspaceIDandPostID from 'services/graphql/queries/GetPostBySubspaceIDandPostID';
import GetPostReactions from 'services/graphql/queries/GetReactions';

const useHooks = ({
  subspaceID,
  commentID,
}: {
  subspaceID: number;
  commentID: number;
}) => {
  const {navigate} = useNavigation<NavProps['navigation']>();

  const {
    data: originalComment,
    loading: mainCommentLoading,
    refetch: mainCommentRefetch,
  } = useQuery(GetPostBySubspaceIDandPostID, {
    variables: {
      ID: commentID,
      subspaceID,
    },
  });

  const {data: commentReplies, loading: commentsLoading} = useQuery(
    GetCommentReplies,
    {
      variables: {
        postID: commentID,
        subspaceID,
        limit: 99,
        offset: 0,
      },
    },
  );

  const {data: commentReactions} = useQuery(GetPostReactions, {
    variables: {
      postID: commentID,
      subspaceID,
      limit: 99,
      offset: 0,
    },
  });

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

  const handlePressSendTips = React.useCallback(() => {
    navigate(ROUTES.SEND_TIPS);
  }, []);

  const handleExpandComment = React.useCallback(
    ({author, postId}: {author: PostAuthor; postId: string}) => {
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
    reactions,
    handlePressCounters,
    handlePressSendTips,
    handleExpandComment,
  };
};

export default useHooks;
